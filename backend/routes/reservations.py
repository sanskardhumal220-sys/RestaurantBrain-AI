from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.config import db
from models.user import User
from models.restaurant import Reservation
from utils.decorators import role_required

reservations_bp = Blueprint('reservations', __name__)

@reservations_bp.route('/', methods=['GET'])
@jwt_required()
def get_reservations():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role == 'Restaurant Owner' or user.role == 'Staff':
        reservations = Reservation.query.order_by(Reservation.date.desc(), Reservation.time.desc()).all()
    else:
        reservations = Reservation.query.filter_by(customer_id=user_id).order_by(Reservation.date.desc(), Reservation.time.desc()).all()
        
    return jsonify([r.to_dict() for r in reservations]), 200

@reservations_bp.route('/', methods=['POST'])
@jwt_required()
def create_reservation():
    customer_id = get_jwt_identity()
    data = request.get_json()
    
    new_res = Reservation(
        customer_id=customer_id,
        date=data['date'],
        time=data['time'],
        guests=data['guests']
    )
    db.session.add(new_res)
    db.session.commit()
    return jsonify(new_res.to_dict()), 201

@reservations_bp.route('/<int:res_id>/status', methods=['PUT'])
@jwt_required()
@role_required(['Restaurant Owner'])
def update_status(res_id):
    res = Reservation.query.get_or_404(res_id)
    data = request.get_json()
    
    if 'status' in data:
        res.status = data['status']
        db.session.commit()
        
    return jsonify(res.to_dict()), 200
