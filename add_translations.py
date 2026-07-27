import json
import os
from deep_translator import GoogleTranslator

keys = {
    "welcome": "Welcome back",
    "explore_menu": "Explore Menu",
    "live_tracking": "Live Tracking",
    "book_table": "Book a Table",
    "my_bookings": "My Bookings",
    "your_cart": "Your Cart",
    "search_placeholder": "What are you craving?",
    "all": "All",
    "veg_only": "Veg Only",
    "no_items": "No items found",
    "try_adjusting": "Try adjusting your search or filters.",
    "popular": "Popular",
    "sold_out": "Sold Out",
    "watch_journey": "Watch your order journey from our kitchen to your table.",
    "no_active_orders": "No active orders",
    "hungry": "Hungry? Explore our menu and place an order.",
    "currently": "Currently",
    "est_prep": "Est. Prep",
    "min": "min",
    "order_summary": "Order Summary",
    "total_paid": "Total Paid",
    "reserve_table": "Reserve Your Table",
    "experience_vibe": "Experience the perfect vibe with guaranteed seating.",
    "select_date": "Select Date",
    "time": "Time",
    "guests": "Guests",
    "confirm_reservation": "Confirm Reservation",
    "no_cc": "No credit card required. Free cancellation.",
    "manage_reservations": "Manage your upcoming and past reservations.",
    "no_upcoming_res": "You have no upcoming reservations.",
    "book_now": "Book a Table Now",
    "confirmed_arrive": "Confirmed. Arrive 10 mins early.",
    "your_order": "Your Order",
    "cart_empty": "Your cart is empty",
    "not_added": "Looks like you haven't added anything to your order yet.",
    "browse_menu": "Browse Menu",
    "subtotal": "Subtotal",
    "taxes": "Taxes & Fees",
    "calculated_checkout": "Calculated at checkout",
    "total": "Total",
    "checkout": "Checkout & Place Order",
    "admin": "Admin",
    "restaurant_management": "Restaurant Management",
    "overview": "Overview",
    "menu_management": "Menu Management",
    "tables": "Tables",
    "total_revenue": "Total Revenue",
    "pending_reservations": "Pending Reservations",
    "items_out_of_stock": "Items Out of Stock",
    "revenue_overview": "Revenue Overview",
    "recent_activity": "Recent Activity",
    "add_new_menu_item": "Add New Menu Item",
    "add_category": "Add Category",
    "current_menu": "Current Menu",
    "add_new_table": "Add New Table",
    "staff_portal": "Staff Portal",
    "staff_portal_desc": "Live operational dashboard for kitchen and waitstaff.",
    "kitchen_view": "Kitchen View",
    "waiter_view": "Waiter View",
    "received": "Received",
    "preparing": "Preparing",
    "ready": "Ready",
    "completed": "Completed",
    "served": "Served",
    "cancelled": "Cancelled",
    "start_preparing": "Start Preparing",
    "mark_as_ready": "Mark as Ready",
    "mark_as_served": "Mark as Served",
    "archive_order": "Archive Order",
    "all_clear": "All clear!",
    "no_orders_waiting": "No orders waiting to be served right now.",
    "deliver_these_items": "Deliver these items:"
}

locales_dir = r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\frontend\src\locales"
langs = {'en': 'en', 'es': 'es', 'fr': 'fr', 'de': 'de', 'hi': 'hi'}

for lang_code, translator_lang in langs.items():
    file_path = os.path.join(locales_dir, f"{lang_code}.json")
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    dash_dict = {}
    if lang_code == 'en':
        dash_dict = keys.copy()
    else:
        translator = GoogleTranslator(source='en', target=translator_lang)
        for k, v in keys.items():
            try:
                translated = translator.translate(v)
                dash_dict[k] = translated
            except Exception as e:
                print(f"Error translating {v} to {lang_code}: {e}")
                dash_dict[k] = v
                
    data["dash"] = dash_dict
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Translations updated successfully.")
