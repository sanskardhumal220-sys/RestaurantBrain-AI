from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager
from sqlalchemy import text

# Database and Models
from database.config import db
from routes.auth import auth_bp
from routes.menu import menu_bp
from routes.tables import tables_bp
from routes.reservations import reservations_bp
from routes.orders import orders_bp
from routes.ai_routes import ai_bp

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS
CORS(app)

# Basic configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'restaurant_brain_dev_key_2026')

# Use SQLite by default for development simplicity, easily swappable to MySQL
if os.environ.get('VERCEL'):
    db_path = '/tmp/restaurantbrain.db'
else:
    db_path = os.path.join(basedir, 'restaurantbrain.db')

db_url = os.environ.get('DATABASE_URL', 'sqlite:///' + db_path)
if db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql+pg8000://', 1)
elif db_url.startswith('postgresql://'):
    db_url = db_url.replace('postgresql://', 'postgresql+pg8000://', 1)

# Remove sslmode from query parameters as pg8000 doesn't support it
if '?' in db_url:
    base_url, query = db_url.split('?', 1)
    new_query = '&'.join([q for q in query.split('&') if not q.startswith('sslmode=')])
    db_url = base_url + ('?' + new_query if new_query else '')

app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Add SSL context for remote postgres databases (e.g. Supabase, Neon)
if 'postgresql' in db_url and 'localhost' not in db_url and '127.0.0.1' not in db_url:
    import ssl
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'connect_args': {'ssl_context': ctx}
    }

# JWT Config
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-12345')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400 # 24 hours

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

@app.route('/api/health', methods=['GET'])
def api_health_check():
    health_status = {
        "status": "online",
        "api": "connected",
        "database": "connected",
        "ai": "connected"
    }
    
    # Check DB
    try:
        db.session.execute(text('SELECT 1'))
    except Exception as e:
        health_status["database"] = "disconnected"
        health_status["status"] = "degraded"
        
    return jsonify(health_status)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(menu_bp, url_prefix='/api/menu')
app.register_blueprint(tables_bp, url_prefix='/api/tables')
app.register_blueprint(reservations_bp, url_prefix='/api/reservations')
app.register_blueprint(orders_bp, url_prefix='/api/orders')
app.register_blueprint(ai_bp, url_prefix='/api/ai')

from models.restaurant import Category

# Create tables if they don't exist
with app.app_context():
    db.create_all()
    
    # Initialize default categories if none exist
    if Category.query.count() == 0:
        c1 = Category(name="Fast Food", description="Quick bites and fast food")
        c2 = Category(name="Main Course", description="Hearty and filling main dishes")
        c3 = Category(name="Beverages", description="Refreshing drinks and beverages")
        db.session.add_all([c1, c2, c3])
        db.session.commit()
        print("Initialized default categories")
        
        # Initialize default menu items
        from models.restaurant import MenuItem
        if MenuItem.query.count() == 0:
            m1 = MenuItem(name="Classic Burger", description="Beef patty with cheese", price=12.99, is_veg=False, category_id=c1.id)
            m2 = MenuItem(name="Pizza", description="Margherita pizza", price=14.99, is_veg=True, category_id=c1.id)
            m3 = MenuItem(name="French Fries", description="Crispy potato fries", price=4.99, is_veg=True, category_id=c1.id)
            m4 = MenuItem(name="Coca Cola", description="Chilled soda", price=2.99, is_veg=True, category_id=c3.id)
            m5 = MenuItem(name="Steak", description="Grilled ribeye steak", price=24.99, is_veg=False, category_id=c2.id)
            db.session.add_all([m1, m2, m3, m4, m5])
            db.session.commit()
            print("Initialized default menu items")

@app.route('/')
def index():
    return jsonify({
        "status": "success",
        "message": "Welcome to RestaurantBrain AI API"
    })

@app.route('/health')
def health_check():
    return jsonify({
        "status": "success",
        "message": "System is healthy"
    })

if __name__ == '__main__':
    # Run the application
    app.run(debug=True, host='0.0.0.0', port=5000)
