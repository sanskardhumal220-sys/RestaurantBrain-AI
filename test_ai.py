import requests
import sys

def test_ai():
    url = "http://localhost:5000/api/ai/parse-order"
    
    # We need a JWT token to access this endpoint, but since we just want to test 
    # the prompt logic, we can call gemini_service directly.

    print("Testing gemini_service directly...")
    import os
    import json
    sys.path.append(r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\backend")
    from ai.gemini_service import parse_voice_order
    
    # Load env variables
    from dotenv import load_dotenv
    load_dotenv(r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\backend\.env")
    
    menu_context = [
        {"id": 1, "name": "Classic Burger", "description": "Beef patty, lettuce, tomato", "price": 10.99, "is_veg": False},
        {"id": 2, "name": "Coca Cola", "description": "Can of Coke", "price": 2.50, "is_veg": True}
    ]
    
    transcript = "I'd like two classic burgers and a coke please."
    
    print(f"Transcript: {transcript}")
    try:
        parsed = parse_voice_order(transcript, menu_context)
        print("Parsed result:")
        print(json.dumps(parsed, indent=2))
        
        # Test hydration logic
        hydrated = []
        for p_item in parsed:
            # Note: menu_items here is just dicts for testing
            db_item = next((i for i in menu_context if i['id'] == p_item.get('id')), None)
            if db_item:
                hydrated.append({
                    "item": db_item,
                    "quantity": p_item.get('quantity', 1)
                })
        print("Hydrated result:")
        print(json.dumps(hydrated, indent=2))
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_ai()
