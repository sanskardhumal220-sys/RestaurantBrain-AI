import json
import os
from deep_translator import GoogleTranslator

# 1. New keys for Home.jsx
home_keys = {
    "pill_text": "Powered by Gemini AI | Real-Time Restaurant Operations",
    "hero_title_main": "RestaurantBrain AI",
    "hero_title_sub": "AI-Powered Smart Restaurant Operating System",
    "hero_desc": "RestaurantBrain AI is a modern restaurant management platform that combines real-time restaurant operations with Gemini AI to simplify menu management, order processing, reservations, staff coordination, and business insights through one intelligent dashboard.",
    "get_started": "Get Started",
    "explore_features": "Explore Features",
    "features_title": "Platform Features",
    "features_desc": "Everything you need to manage your restaurant seamlessly.",
    
    # Feature Cards
    "feat_ai_title": "AI Business Copilot",
    "feat_ai_desc": "Use Gemini AI to analyze restaurant operations, answer business questions, and generate intelligent recommendations.",
    "feat_order_title": "Real-Time Order Management",
    "feat_order_desc": "Synchronize customers, kitchen staff, waiters, and restaurant owners through a live order workflow.",
    "feat_role_title": "Role-Based Dashboards",
    "feat_role_desc": "Dedicated dashboards for Customer, Staff, and Restaurant Owner. Secure access to only the features they need.",
    "feat_menu_title": "Digital Menu Management",
    "feat_menu_desc": "Create categories. Manage menu items. Update pricing. Track item availability.",
    "feat_res_title": "Reservation Management",
    "feat_res_desc": "Allow customers to book tables. Approve or reject reservations. Manage seating efficiently.",
    "feat_kds_title": "Kitchen Display System",
    "feat_kds_desc": "Kitchen staff receive orders instantly. Update order progress from Received to Completed.",
    "feat_notif_title": "Live Notifications",
    "feat_notif_desc": "Receive real-time alerts for New Orders, Reservation Updates, Order Status Changes, and Operational Events.",
    "feat_analytics_title": "Restaurant Analytics",
    "feat_analytics_desc": "Monitor Revenue, Orders, Reservations, Restaurant Health Score, and Business Performance.",
    
    # How it works
    "how_it_works": "How It Works",
    "step_1_lbl": "Step 1",
    "step_1_title": "Customer Interaction",
    "step_1_desc": "Customers browse the menu, place orders, and reserve tables.",
    "step_2_lbl": "Step 2",
    "step_2_title": "Restaurant Operations",
    "step_2_desc": "Kitchen staff prepare orders while waiters manage deliveries and table service.",
    "step_3_lbl": "Step 3",
    "step_3_title": "AI Intelligence",
    "step_3_desc": "Gemini AI analyzes operational data and generates business insights, recommendations, and summaries for restaurant owners.",
    
    # Tech Stack
    "why_choose_us": "Why RestaurantBrain AI",
    "benefit_1": "AI-Powered Restaurant Operations",
    "benefit_2": "Secure Role-Based Access",
    "benefit_3": "Real-Time Synchronization",
    "benefit_4": "Intelligent Business Insights",
    "benefit_5": "Digital Menu & Reservation Management",
    "benefit_6": "Modern Responsive Interface",
    "tech_stack": "Technology Stack",
    
    # CTA
    "cta_title": "Ready to Modernize Your Restaurant?",
    "cta_desc": "Experience a smarter way to manage restaurant operations using AI-powered insights and real-time collaboration.",
    "launch_dashboard": "Launch Dashboard",
    "view_demo": "View Demo"
}

locales_dir = r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\frontend\src\locales"

# Update EN
en_path = os.path.join(locales_dir, "en.json")
with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

if "home" not in en_data:
    en_data["home"] = {}
en_data["home"].update(home_keys)

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)

# Update HI
hi_path = os.path.join(locales_dir, "hi.json")
with open(hi_path, 'r', encoding='utf-8') as f:
    hi_data = json.load(f)

if "home" not in hi_data:
    hi_data["home"] = {}

translator = GoogleTranslator(source='en', target='hi')
for k, v in home_keys.items():
    if k not in hi_data["home"] or hi_data["home"][k] == v:
        try:
            hi_data["home"][k] = translator.translate(v)
            print(f"Translated {k}")
        except Exception as e:
            hi_data["home"][k] = v

with open(hi_path, 'w', encoding='utf-8') as f:
    json.dump(hi_data, f, ensure_ascii=False, indent=2)

print("JSON files updated!")
