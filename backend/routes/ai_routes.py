from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, date
from database.config import db
from models.restaurant import Order, Reservation, MenuItem
from utils.decorators import role_required
from ai.gemini_service import generate_smart_insights, copilot_chat, generate_recommendations, generate_health_explanation, parse_voice_order

ai_bp = Blueprint('ai', __name__)

def get_restaurant_context():
    # Gather essential context for the AI
    today_str = date.today().isoformat()
    
    orders = Order.query.all()
    reservations = Reservation.query.all()
    menu_items = MenuItem.query.all()
    
    total_revenue = sum(o.total_amount for o in orders)
    pending_orders = sum(1 for o in orders if o.status not in ['Completed', 'Served'])
    
    low_stock = [item.name for item in menu_items if item.availability == 'Low Stock']
    out_of_stock = [item.name for item in menu_items if item.availability == 'Out of Stock']
    
    # Very basic popular dish proxy: count occurrences in OrderItems
    # Since we can't do complex joins easily here without importing OrderItem, we'll keep it simple for now
    
    context = {
        "today_date": today_str,
        "metrics": {
            "total_revenue": round(total_revenue, 2),
            "total_orders": len(orders),
            "pending_orders": pending_orders,
            "total_reservations": len(reservations),
            "pending_reservations": sum(1 for r in reservations if r.status == 'Pending'),
        },
        "inventory": {
            "low_stock": low_stock,
            "out_of_stock": out_of_stock
        }
    }
    return context

@ai_bp.route('/summary', methods=['GET'])
@jwt_required()
@role_required(['Restaurant Owner'])
def get_summary():
    context = get_restaurant_context()
    return jsonify(context), 200

@ai_bp.route('/insights', methods=['GET'])
@jwt_required()
@role_required(['Restaurant Owner'])
def get_insights():
    lang = request.headers.get('Accept-Language', 'en')
    context = get_restaurant_context()
    result = generate_smart_insights(context, lang)
    return jsonify(result), 200

@ai_bp.route('/chat', methods=['POST'])
@jwt_required()
@role_required(['Restaurant Owner'])
def chat():
    lang = request.headers.get('Accept-Language', 'en')
    data = request.get_json()
    user_message = data.get('message', '')
    if not user_message:
        return jsonify({"error": "Message is required"}), 400
        
    context = get_restaurant_context()
    reply = copilot_chat(user_message, context, lang)
    return jsonify({"reply": reply}), 200

@ai_bp.route('/health-score', methods=['GET'])
@jwt_required()
@role_required(['Restaurant Owner'])
def get_health_score():
    lang = request.headers.get('Accept-Language', 'en')
    context = get_restaurant_context()
    metrics = context['metrics']
    
    # Calculate basic health score out of 100
    score = 100
    if metrics['total_orders'] > 0:
        completion_rate = (metrics['total_orders'] - metrics['pending_orders']) / metrics['total_orders']
        score -= (1 - completion_rate) * 20  # Max -20 penalty for incomplete orders
    
    if metrics['pending_reservations'] > 0:
        score -= metrics['pending_reservations'] * 2 # -2 per pending reservation
        
    out_of_stock = len(context['inventory']['out_of_stock'])
    if out_of_stock > 0:
        score -= out_of_stock * 3 # -3 per out of stock item
        
    score = max(0, min(100, round(score)))
    
    explanation = generate_health_explanation(context, score, lang)
    
    return jsonify({
        "score": score,
        "explanation": explanation,
        "status": "Excellent" if score >= 90 else "Good" if score >= 70 else "Needs Attention"
    }), 200

@ai_bp.route('/recommendations', methods=['GET'])
@jwt_required()
@role_required(['Restaurant Owner'])
def get_recommendations():
    lang = request.headers.get('Accept-Language', 'en')
    context = get_restaurant_context()
    recs = generate_recommendations(context, lang)
    return jsonify({"recommendations": recs}), 200

@ai_bp.route('/timeline', methods=['GET'])
@jwt_required()
@role_required(['Restaurant Owner'])
def get_timeline():
    # Fetch today's orders
    orders = Order.query.all() # In production, filter by today
    reservations = Reservation.query.all()
    
    events = []
    
    # Very basic event generation based on the data
    if len(orders) > 0:
        events.append({"time": "10:05 AM", "title": f"{len(orders)} orders received", "type": "order"})
    if len(reservations) > 0:
        events.append({"time": "11:15 AM", "title": f"{len(reservations)} reservations logged", "type": "reservation"})
    if len(orders) > 3:
        events.append({"time": "12:40 PM", "title": "Peak lunch hour traffic", "type": "alert"})
    
    if not events:
        events.append({"time": "08:00 AM", "title": "Restaurant Opened", "type": "info"})
        
    return jsonify({"timeline": events}), 200

@ai_bp.route('/parse-order', methods=['POST'])
@jwt_required()
@role_required(['Customer', 'Staff', 'Restaurant Owner'])
def parse_order():
    data = request.get_json()
    transcript = data.get('transcript', '')
    
    if not transcript:
        return jsonify({"error": "Transcript is required"}), 400
        
    # Get all menu items
    menu_items = MenuItem.query.all()
    menu_context = [{"id": item.id, "name": item.name, "description": item.description, "price": item.price, "is_veg": item.is_veg} for item in menu_items]
    
    parsed_items = parse_voice_order(transcript, menu_context)
    
    if isinstance(parsed_items, dict) and 'error' in parsed_items:
        return jsonify(parsed_items), 500
        
    # Hydrate the parsed items with full menu item details so the frontend has what it needs
    hydrated_items = []
    for p_item in parsed_items:
        db_item = next((i for i in menu_items if i.id == p_item.get('id')), None)
        if db_item:
            hydrated_items.append({
                "item": {
                    "id": db_item.id,
                    "name": db_item.name,
                    "price": db_item.price,
                    "image_url": db_item.image_url
                },
                "quantity": p_item.get('quantity', 1)
            })
            
    return jsonify({"items": hydrated_items}), 200
