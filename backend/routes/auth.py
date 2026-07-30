from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from database.config import db
from models.user import User
from models.restaurant import Order, Reservation, MenuItem
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy import text
import os

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/migrate-db', methods=['GET'])
def migrate_db():
    results = []
    
    # 1. Add google_id
    try:
        db.session.execute(text("ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE;"))
        db.session.commit()
        results.append("google_id column added successfully.")
    except Exception as e:
        db.session.rollback()
        results.append(f"google_id skip (may exist): {str(e)}")
        
    # 2. Add profile_picture
    try:
        db.session.execute(text("ALTER TABLE users ADD COLUMN profile_picture VARCHAR(1000);"))
        db.session.commit()
        results.append("profile_picture column added successfully.")
    except Exception as e:
        db.session.rollback()
        results.append(f"profile_picture skip (may exist): {str(e)}")
        
    # 3. Add auth_provider
    try:
        db.session.execute(text("ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'email' NOT NULL;"))
        db.session.commit()
        results.append("auth_provider column added successfully.")
    except Exception as e:
        db.session.rollback()
        results.append(f"auth_provider skip (may exist): {str(e)}")
        
    # 4. Make password_hash nullable
    try:
        # This syntax works for Postgres
        db.session.execute(text("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;"))
        db.session.commit()
        results.append("password_hash made nullable successfully.")
    except Exception as e:
        db.session.rollback()
        results.append(f"password_hash nullable skip (may already be nullable or SQLite): {str(e)}")
        
    return jsonify({
        "message": "Migration attempts completed.",
        "details": results
    }), 200


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    full_name = data.get('fullName')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    role = data.get('role', 'Customer')

    if not all([full_name, email, password]):
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User with this email already exists"}), 409

    hashed_password = generate_password_hash(password)
    
    new_user = User(
        full_name=full_name,
        email=email,
        phone=phone,
        password_hash=hashed_password,
        role=role
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Registration failed", "error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
    
    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    return jsonify({"user": user.to_dict()}), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # In a fully stateless JWT setup, logout is handled client-side by deleting the token.
    # To invalidate tokens server-side, a blocklist would be required.
    # For now, we simply return a success message.
    return jsonify({"message": "Successfully logged out"}), 200

@auth_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    notifications = []
    
    # If Owner or Staff
    if user.role.lower() in ['restaurant owner', 'restaurant_admin', 'staff']:
        # Low stock
        low_stock_items = MenuItem.query.filter(MenuItem.availability.in_(['Low Stock', 'Out of Stock'])).all()
        for item in low_stock_items:
            notifications.append({
                "id": f"stock_{item.id}",
                "text": f"{item.availability} alert: {item.name}",
                "time": "Just now",
                "type": "alert"
            })
            
        # Pending Reservations
        pending_reservations = Reservation.query.filter_by(status='Pending').all()
        for res in pending_reservations:
            notifications.append({
                "id": f"res_{res.id}",
                "text": f"New reservation: {res.guests} pax on {res.date} at {res.time}",
                "time": "Recent",
                "type": "reservation"
            })
            
        # Recent Orders (Not completed)
        active_orders = Order.query.filter(~Order.status.in_(['Completed', 'Served'])).all()
        for order in active_orders:
            notifications.append({
                "id": f"order_{order.id}_{order.status}",
                "text": f"Order #{order.id} is {order.status}",
                "time": "Recent",
                "type": "order"
            })
    else:
        # For Customer
        my_orders = Order.query.filter_by(customer_id=user.id).filter(~Order.status.in_(['Completed'])).all()
        for order in my_orders:
            notifications.append({
                "id": f"order_{order.id}_{order.status}",
                "text": f"Your order #{order.id} is {order.status}",
                "time": "Recent",
                "type": "order"
            })
            
        my_res = Reservation.query.filter_by(customer_id=user.id, status='Approved').all()
        for res in my_res:
            notifications.append({
                "id": f"res_{res.id}_{res.status}",
                "text": f"Your reservation for {res.date} was Approved!",
                "time": "Recent",
                "type": "reservation"
            })
            
    # Default message if no notifications
    if not notifications:
        notifications.append({
            "id": "welcome",
            "text": "Welcome to RestaurantBrain!",
            "time": "Just now",
            "type": "info"
        })
        
    return jsonify({"notifications": notifications}), 200

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"message": "Email is required"}), 400
        
    # In a real app, we would verify the email exists and send a reset link
    # For now, we mock the success response to avoid giving away user enumeration
    return jsonify({"message": "If the email is registered, a password reset link has been sent."}), 200

@auth_bp.route('/google-login', methods=['POST'])
def google_login():
    data = request.get_json()
    token = data.get('credential')
    
    if not token:
        return jsonify({"message": "Google authentication failed, no token provided"}), 400
        
    try:
        # Verify the token
        client_id = os.environ.get("GOOGLE_CLIENT_ID")
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)
        
        email = idinfo.get('email')
        name = idinfo.get('name')
        picture = idinfo.get('picture')
        google_id = idinfo.get('sub')
        
        if not email:
            return jsonify({"message": "Google authentication failed"}), 400
            
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # User doesn't exist, we need them to select a role
            return jsonify({
                "requires_role": True,
                "email": email,
                "name": name,
                "picture": picture,
                "google_id": google_id
            }), 200
            
        # Update existing user if they were email/password before
        if not user.google_id:
            user.google_id = google_id
            user.profile_picture = picture
            user.auth_provider = 'google'
            db.session.commit()
            
        access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
        
        return jsonify({
            "message": "Google Login successful",
            "token": access_token,
            "user": user.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({"message": "Invalid token", "error": str(e)}), 401

@auth_bp.route('/google-register', methods=['POST'])
def google_register():
    data = request.get_json()
    token = data.get('credential')
    role = data.get('role')
    
    if not token or not role:
        return jsonify({"message": "Missing token or role"}), 400
        
    try:
        # Verify the token
        client_id = os.environ.get("GOOGLE_CLIENT_ID")
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), client_id)
        
        email = idinfo.get('email')
        name = idinfo.get('name')
        picture = idinfo.get('picture')
        google_id = idinfo.get('sub')
        
        if not email:
            return jsonify({"message": "Google authentication failed"}), 400
            
        user = User.query.filter_by(email=email).first()
        
        if user:
            return jsonify({"message": "User already exists"}), 409
            
        # Create a new Google user
        user = User(
            full_name=name,
            email=email,
            phone="",
            password_hash=None,
            role=role,
            google_id=google_id,
            profile_picture=picture,
            auth_provider='google'
        )
        try:
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to create Google user", "error": str(e)}), 500
            
        access_token = create_access_token(identity=str(user.id), additional_claims={"role": user.role})
        
        return jsonify({
            "message": "Google Registration successful",
            "token": access_token,
            "user": user.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({"message": "Invalid token", "error": str(e)}), 401

@auth_bp.route('/demo', methods=['POST'])
def demo_login():
    # Create or get a mock Restaurant Owner for the demo
    demo_email = 'demo_owner@restaurantbrain.ai'
    user = User.query.filter_by(email=demo_email).first()
    
    if not user:
        hashed_password = generate_password_hash("demo_password_123")
        user = User(
            full_name="Demo Owner",
            email=demo_email,
            phone="555-0199",
            password_hash=hashed_password,
            role="Restaurant Owner"
        )
        try:
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": "Failed to create demo user", "error": str(e)}), 500
            
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        "message": "Demo Login successful",
        "token": access_token,
        "user": user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    data = request.get_json()
    
    if 'fullName' in data and data['fullName']:
        user.full_name = data['fullName']
    if 'phone' in data:
        user.phone = data['phone']
    if 'profilePicture' in data and data['profilePicture']:
        user.profile_picture = data['profilePicture']
        
    if 'currentPassword' in data and data['currentPassword'] and 'newPassword' in data and data['newPassword']:
        if not check_password_hash(user.password_hash, data['currentPassword']):
            return jsonify({"message": "Incorrect current password"}), 400
        user.password_hash = generate_password_hash(data['newPassword'])
        
    try:
        db.session.commit()
        return jsonify({
            "message": "Profile updated successfully",
            "user": user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update profile", "error": str(e)}), 500
