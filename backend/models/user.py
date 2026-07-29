from database.config import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    password_hash = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(50), nullable=False, default='Customer')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    google_id = db.Column(db.String(255), unique=True, nullable=True)
    profile_picture = db.Column(db.String(1000), nullable=True)
    auth_provider = db.Column(db.String(50), nullable=False, default='email')

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'phone': self.phone,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'profile_picture': self.profile_picture,
            'auth_provider': self.auth_provider
        }
