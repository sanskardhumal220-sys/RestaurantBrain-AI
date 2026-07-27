from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database.config import db
from models.restaurant import Category, MenuItem
from utils.decorators import role_required

menu_bp = Blueprint('menu', __name__)

# --- Categories ---
@menu_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories]), 200

@menu_bp.route('/categories', methods=['POST'])
@jwt_required()
@role_required(['Restaurant Owner'])
def create_category():
    data = request.get_json()
    new_cat = Category(name=data['name'], description=data.get('description'))
    db.session.add(new_cat)
    db.session.commit()
    return jsonify(new_cat.to_dict()), 201

# --- Menu Items ---
@menu_bp.route('/items', methods=['GET'])
def get_menu_items():
    items = MenuItem.query.all()
    return jsonify([item.to_dict() for item in items]), 200

@menu_bp.route('/items', methods=['POST'])
@jwt_required()
@role_required(['Restaurant Owner'])
def add_menu_item():
    data = request.get_json()
    new_item = MenuItem(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        category_id=data['category_id'],
        is_veg=data.get('is_veg', True),
        image_url=data.get('image_url'),
        availability=data.get('availability', 'Available')
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@menu_bp.route('/items/<int:item_id>', methods=['PUT'])
@jwt_required()
@role_required(['Restaurant Owner'])
def update_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    data = request.get_json()
    
    item.name = data.get('name', item.name)
    item.description = data.get('description', item.description)
    item.price = data.get('price', item.price)
    item.category_id = data.get('category_id', item.category_id)
    item.is_veg = data.get('is_veg', item.is_veg)
    item.image_url = data.get('image_url', item.image_url)
    item.availability = data.get('availability', item.availability)
    
    db.session.commit()
    return jsonify(item.to_dict()), 200

@menu_bp.route('/items/<int:item_id>', methods=['DELETE'])
@jwt_required()
@role_required(['Restaurant Owner'])
def delete_menu_item(item_id):
    item = MenuItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item deleted"}), 200
