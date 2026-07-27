import re

file_path = r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\frontend\src\pages\Home.jsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if "import { useTranslation } from 'react-i18next';" not in content:
    content = content.replace("import { Link } from 'react-router-dom';", "import { Link } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';")

# Add hook
if "const { t } = useTranslation();" not in content:
    content = content.replace("const Home = () => {\n", "const Home = () => {\n  const { t } = useTranslation();\n")

# Replace texts
replacements = {
    "Powered by Gemini AI | Real-Time Restaurant Operations": "{t('home.pill_text')}",
    "RestaurantBrain AI\n        </motion.h1>": "{t('home.hero_title_main')}\n        </motion.h1>",
    "AI-Powered Smart Restaurant Operating System": "{t('home.hero_title_sub')}",
    "RestaurantBrain AI is a modern restaurant management platform that combines real-time restaurant operations with Gemini AI to simplify menu management, order processing, reservations, staff coordination, and business insights through one intelligent dashboard.": "{t('home.hero_desc')}",
    "Get Started": "{t('home.get_started')}",
    "Explore Features": "{t('home.explore_features')}",
    "Platform Features": "{t('home.features_title')}",
    "Everything you need to manage your restaurant seamlessly.": "{t('home.features_desc')}",
    
    '"AI Business Copilot"': "t('home.feat_ai_title')",
    '"Use Gemini AI to analyze restaurant operations, answer business questions, and generate intelligent recommendations."': "t('home.feat_ai_desc')",
    '"Real-Time Order Management"': "t('home.feat_order_title')",
    '"Synchronize customers, kitchen staff, waiters, and restaurant owners through a live order workflow."': "t('home.feat_order_desc')",
    '"Role-Based Dashboards"': "t('home.feat_role_title')",
    '"Dedicated dashboards for Customer, Staff, and Restaurant Owner. Secure access to only the features they need."': "t('home.feat_role_desc')",
    '"Digital Menu Management"': "t('home.feat_menu_title')",
    '"Create categories. Manage menu items. Update pricing. Track item availability."': "t('home.feat_menu_desc')",
    '"Reservation Management"': "t('home.feat_res_title')",
    '"Allow customers to book tables. Approve or reject reservations. Manage seating efficiently."': "t('home.feat_res_desc')",
    '"Kitchen Display System"': "t('home.feat_kds_title')",
    '"Kitchen staff receive orders instantly. Update order progress from Received to Completed."': "t('home.feat_kds_desc')",
    '"Live Notifications"': "t('home.feat_notif_title')",
    '"Receive real-time alerts for New Orders, Reservation Updates, Order Status Changes, and Operational Events."': "t('home.feat_notif_desc')",
    '"Restaurant Analytics"': "t('home.feat_analytics_title')",
    '"Monitor Revenue, Orders, Reservations, Restaurant Health Score, and Business Performance."': "t('home.feat_analytics_desc')",
    
    "How It Works": "{t('home.how_it_works')}",
    '"Step 1"': "t('home.step_1_lbl')",
    '"Customer Interaction"': "t('home.step_1_title')",
    '"Customers browse the menu, place orders, and reserve tables."': "t('home.step_1_desc')",
    '"Step 2"': "t('home.step_2_lbl')",
    '"Restaurant Operations"': "t('home.step_2_title')",
    '"Kitchen staff prepare orders while waiters manage deliveries and table service."': "t('home.step_2_desc')",
    '"Step 3"': "t('home.step_3_lbl')",
    '"AI Intelligence"': "t('home.step_3_title')",
    '"Gemini AI analyzes operational data and generates business insights, recommendations, and summaries for restaurant owners."': "t('home.step_3_desc')",
    
    "Why RestaurantBrain AI": "{t('home.why_choose_us')}",
    '"AI-Powered Restaurant Operations"': "t('home.benefit_1')",
    '"Secure Role-Based Access"': "t('home.benefit_2')",
    '"Real-Time Synchronization"': "t('home.benefit_3')",
    '"Intelligent Business Insights"': "t('home.benefit_4')",
    '"Digital Menu & Reservation Management"': "t('home.benefit_5')",
    '"Modern Responsive Interface"': "t('home.benefit_6')",
    
    "Technology Stack": "{t('home.tech_stack')}",
    "Ready to Modernize Your Restaurant?": "{t('home.cta_title')}",
    "Experience a smarter way to manage restaurant operations using AI-powered insights and real-time collaboration.": "{t('home.cta_desc')}",
    "Launch Dashboard": "{t('home.launch_dashboard')}",
    "View Demo": "{t('home.view_demo')}"
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Home.jsx updated!")
