from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from database.config import db
from models.restaurant import Table
from utils.decorators import role_required

tables_bp = Blueprint('tables', __name__)

@tables_bp.route('/', methods=['GET'])
def get_tables():
    tables = Table.query.all()
    return jsonify([t.to_dict() for t in tables]), 200

@tables_bp.route('/', methods=['POST'])
@jwt_required()
@role_required(['Restaurant Owner'])
def add_table():
    data = request.get_json()
    new_table = Table(
        table_number=data['table_number'],
        capacity=data['capacity'],
        status=data.get('status', 'Available')
    )
    db.session.add(new_table)
    db.session.commit()
    return jsonify(new_table.to_dict()), 201

@tables_bp.route('/<int:table_id>', methods=['PUT'])
@jwt_required()
@role_required(['Restaurant Owner'])
def update_table(table_id):
    table = Table.query.get_or_404(table_id)
    data = request.get_json()
    
    table.table_number = data.get('table_number', table.table_number)
    table.capacity = data.get('capacity', table.capacity)
    table.status = data.get('status', table.status)
    
    db.session.commit()
    return jsonify(table.to_dict()), 200

@tables_bp.route('/<int:table_id>', methods=['DELETE'])
@jwt_required()
@role_required(['Restaurant Owner'])
def delete_table(table_id):
    table = Table.query.get_or_404(table_id)
    db.session.delete(table)
    db.session.commit()
    return jsonify({"message": "Table deleted"}), 200
