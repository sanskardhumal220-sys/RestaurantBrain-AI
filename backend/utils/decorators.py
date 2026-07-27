from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from models.user import User

def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            from flask_jwt_extended import get_jwt
            claims = get_jwt()
            user_role = claims.get('role')
            if not user_role or user_role not in allowed_roles:
                return jsonify({"message": "Access Denied: Insufficient permissions"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator
