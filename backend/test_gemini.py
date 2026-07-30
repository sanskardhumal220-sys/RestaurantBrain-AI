import os
from google import genai
from dotenv import load_dotenv
import json

load_dotenv()
api_key = os.environ.get('GEMINI_API_KEY')
client = genai.Client(api_key=api_key)

context_data = {
    "today_date": "2026-07-25",
    "metrics": {
        "total_revenue": 100.0,
        "total_orders": 5,
        "pending_orders": 1,
        "total_reservations": 2,
        "pending_reservations": 0,
    },
    "inventory": {
        "low_stock": [],
        "out_of_stock": []
    }
}

user_message = "dish"
prompt = f"""
You are a smart AI Business Copilot for a restaurant owner.
You have access to the current restaurant data below.
Answer the owner's question accurately based on the data provided.
If the data doesn't contain the answer, say you don't have enough information right now.
Keep your answers concise, professional, and directly actionable.

Restaurant Data Context:
{json.dumps(context_data, default=str, indent=2)}

Owner's Question: {user_message}
"""

try:
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=prompt
    )
    print("SUCCESS:")
    print(response.text)
except Exception as e:
    print(f"Error: {str(e)}")
