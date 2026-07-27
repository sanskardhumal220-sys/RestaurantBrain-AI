from app import app
from database.config import db
from models.user import User

with app.app_context():
    for u in User.query.all():
        print(f"Email: {u.email}, Role: {u.role}")
