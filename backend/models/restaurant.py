from database.config import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    items = db.relationship('MenuItem', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    is_veg = db.Column(db.Boolean, default=True)
    image_url = db.Column(db.String(500), nullable=True)
    availability = db.Column(db.String(50), default='Available') # Available, Low Stock, Out of Stock

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category_id': self.category_id,
            'category_name': self.category.name if self.category else None,
            'is_veg': self.is_veg,
            'image_url': self.image_url,
            'availability': self.availability
        }

class Table(db.Model):
    __tablename__ = 'tables'
    id = db.Column(db.Integer, primary_key=True)
    table_number = db.Column(db.String(20), unique=True, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='Available') # Available, Occupied, Reserved

    def to_dict(self):
        return {
            'id': self.id,
            'table_number': self.table_number,
            'capacity': self.capacity,
            'status': self.status
        }

class Reservation(db.Model):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.String(20), nullable=False) # Format: YYYY-MM-DD
    time = db.Column(db.String(20), nullable=False) # Format: HH:MM
    guests = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), default='Pending') # Pending, Approved, Rejected
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    customer = db.relationship('User', backref='reservations')
    table = db.relationship('Table', backref='reservations')

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'customer_name': self.customer.full_name if self.customer else None,
            'date': self.date,
            'time': self.time,
            'guests': self.guests,
            'status': self.status,
            'table_id': self.table_id,
            'table_number': self.table.table_number if self.table else None,
            'created_at': self.created_at.isoformat()
        }

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=True)
    status = db.Column(db.String(50), default='Received') # Received, Preparing, Ready, Served, Completed
    total_amount = db.Column(db.Float, nullable=False)
    estimated_prep_time = db.Column(db.Integer, default=30) # in minutes
    notes = db.Column(db.Text, nullable=True)
    guests = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    customer = db.relationship('User', backref='orders')
    table = db.relationship('Table', backref='orders')
    items = db.relationship('OrderItem', backref='order', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'customer_name': self.customer.full_name if self.customer else None,
            'table_id': self.table_id,
            'table_number': self.table.table_number if self.table else None,
            'status': self.status,
            'total_amount': self.total_amount,
            'estimated_prep_time': self.estimated_prep_time,
            'notes': self.notes,
            'guests': self.guests,
            'created_at': self.created_at.isoformat(),
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False) # price at the time of order

    menu_item = db.relationship('MenuItem')

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'menu_item_id': self.menu_item_id,
            'menu_item_name': self.menu_item.name if self.menu_item else None,
            'quantity': self.quantity,
            'price': self.price
        }
