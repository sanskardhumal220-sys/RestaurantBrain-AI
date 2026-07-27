from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.config import db
from models.user import User
from models.restaurant import Order, OrderItem, MenuItem
from utils.decorators import role_required

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role == 'Customer':
        orders = Order.query.filter_by(customer_id=user_id).order_by(Order.created_at.desc()).all()
    elif user.role == 'Staff' or user.role == 'Restaurant Owner':
        # Active orders first
        orders = Order.query.order_by(
            db.case(
                (Order.status == 'Received', 1),
                (Order.status == 'Preparing', 2),
                (Order.status == 'Ready', 3),
                (Order.status == 'Served', 4),
                (Order.status == 'Completed', 5)
            ),
            Order.created_at.desc()
        ).all()
        
    return jsonify([o.to_dict() for o in orders]), 200

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    customer_id = get_jwt_identity()
    data = request.get_json()
    
    items = data.get('items', [])
    if not items:
        return jsonify({"message": "Order must contain items"}), 400
        
    total_amount = 0
    new_order = Order(
        customer_id=customer_id,
        table_id=data.get('table_id'),
        notes=data.get('notes', ''),
        guests=data.get('guests', 1),
        total_amount=0 # Will calculate below
    )
    db.session.add(new_order)
    db.session.flush() # Get the new_order ID
    
    for item_data in items:
        menu_item = MenuItem.query.get(item_data['menu_item_id'])
        if menu_item:
            order_item = OrderItem(
                order_id=new_order.id,
                menu_item_id=menu_item.id,
                quantity=item_data['quantity'],
                price=menu_item.price
            )
            db.session.add(order_item)
            total_amount += menu_item.price * item_data['quantity']
            
    new_order.total_amount = total_amount
    db.session.commit()
    
    return jsonify(new_order.to_dict()), 201

@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@jwt_required()
@role_required(['Staff', 'Restaurant Owner'])
def update_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    
    if 'status' in data:
        # Validate status transitions if necessary, here we just trust the staff/owner
        order.status = data['status']
        db.session.commit()
        
    return jsonify(order.to_dict()), 200
