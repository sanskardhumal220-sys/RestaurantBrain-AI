import os
from google import genai
import json

def get_genai_client():
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return None
    return genai.Client(api_key=api_key)

def generate_smart_insights(context_data, lang='en'):
    model = get_genai_client()
    if not model:
        return {
            "error": "Gemini API key not configured. Using placeholder data.",
            "insights": [
                {"title": "Revenue Trend", "description": "Placeholder: Revenue is up by 15% this week.", "type": "positive"},
                {"title": "Popular Dishes", "description": "Placeholder: Burger is your top seller.", "type": "info"},
                {"title": "Inventory Warning", "description": "Placeholder: Tomato stock is low.", "type": "warning"}
            ]
        }

    prompt = f"""
    You are an expert AI restaurant consultant. Analyze the following real-time restaurant data and provide 3-5 actionable smart insights.
    Focus on revenue trends, popular/slow-moving dishes, customer behavior, and inventory warnings.
    CRITICAL: YOU MUST RESPOND ENTIRELY IN THE LANGUAGE "{lang}".
    
    Restaurant Data:
    {json.dumps(context_data, default=str, indent=2)}
    
    Return ONLY a raw JSON array of objects. Do not include markdown formatting like ```json.
    Each object must have:
    - "title": A short title for the insight.
    - "description": A clear, actionable description (1-2 sentences).
    - "type": One of ["positive", "warning", "info"].
    """
    
    try:
        response = model.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        text = response.text.strip()
        if text.startswith('```json'):
            text = text[7:-3]
        if text.startswith('```'):
            text = text[3:-3]
        
        insights = json.loads(text.strip())
        return {"insights": insights}
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return {"error": "Failed to generate insights from Gemini."}

def copilot_chat(user_message, context_data, lang='en'):
    model = get_genai_client()
    if not model:
        return "I'm sorry, but my AI capabilities are currently offline because the GEMINI_API_KEY is not configured in the backend."

    prompt = f"""
    You are a smart AI Business Copilot for a restaurant owner.
    You have access to the current restaurant data below.
    Answer the owner's question accurately based on the data provided.
    If the data doesn't contain the answer, say you don't have enough information right now.
    Keep your answers concise, professional, and directly actionable.
    CRITICAL: YOU MUST RESPOND ENTIRELY IN THE LANGUAGE "{lang}".
    
    Restaurant Data Context:
    {json.dumps(context_data, default=str, indent=2)}
    
    Owner's Question: {user_message}
    """
    
    try:
        response = model.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return "Sorry, I encountered an error while trying to process your request."

def generate_recommendations(context_data, lang='en'):
    model = get_genai_client()
    if not model:
        return [
            {"title": "Enable AI", "description": "Configure Gemini API Key for smart recommendations."}
        ]

    prompt = f"""
    You are an AI restaurant consultant. Based on this real-time data, provide exactly 4 brief, highly actionable operational or menu recommendations.
    Focus on combos, increasing stock, or improving customer experience.
    CRITICAL: YOU MUST RESPOND ENTIRELY IN THE LANGUAGE "{lang}".
    
    Restaurant Data:
    {json.dumps(context_data, default=str, indent=2)}
    
    Return ONLY a raw JSON array of objects. Do not include markdown formatting like ```json.
    Each object must have:
    - "title": A short title (2-4 words).
    - "description": A clear, actionable recommendation (1 sentence).
    """
    
    try:
        response = model.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        text = response.text.strip()
        if text.startswith('```json'): text = text[7:-3]
        if text.startswith('```'): text = text[3:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return [{"title": "Analysis Failed", "description": "Could not generate recommendations."}]

def generate_health_explanation(context_data, score, lang='en'):
    model = get_genai_client()
    if not model:
        return "Configure your API key to get AI health explanations."

    prompt = f"""
    You are an AI restaurant manager. The restaurant's current health score is {score}/100.
    Based on the score and the data below, provide a very short, punchy 1-2 sentence explanation of why the score is what it is.
    CRITICAL: YOU MUST RESPOND ENTIRELY IN THE LANGUAGE "{lang}".
    
    Restaurant Data:
    {json.dumps(context_data, default=str, indent=2)}
    
    Return ONLY the raw text explanation. No markdown.
    """
    try:
        response = model.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini API Error: {str(e)}")
        return "Explanation currently unavailable."

def parse_voice_order(transcript, menu_context):
    model = get_genai_client()
    if not model:
        return {"error": "Gemini API key not configured"}
        
    prompt = f"""
    You are a smart Point-of-Sale (POS) AI assistant for a restaurant.
    Your task is to take a customer's spoken natural language order (which may contain typos from voice-to-text) and map it EXACTLY to the available menu items provided below.
    
    Available Menu Items:
    {json.dumps(menu_context, default=str, indent=2)}
    
    Customer's Spoken Order: "{transcript}"
    
    Instructions:
    1. Match the spoken words to the closest available menu items using fuzzy matching logic (e.g. "coke" or "cola" = "Coca Cola", "burger" = "Classic Burger", "french fries" = "fries").
    2. Determine the quantity for each requested item (default to 1 if not explicitly stated, e.g. "a pizza" = 1 pizza).
    3. Ignore conversational filler (like "uhm", "please", "I'd like").
    4. You MUST return ONLY a raw JSON array of objects. Do not include markdown formatting.
    
    Examples:
    - If menu has [{{"id": 1, "name": "Pizza"}}] and user says "I want two pizzas", return: [{{"id": 1, "quantity": 2}}]
    - If menu has [{{"id": 2, "name": "Coke"}}] and user says "one coke please", return: [{{"id": 2, "quantity": 1}}]
    - If menu has [{{"id": 3, "name": "French Fries"}}] and user says "give me fries", return: [{{"id": 3, "quantity": 1}}]
    
    Format required:
    [
      {{"id": 1, "quantity": 2}}
    ]
    
    If absolutely nothing matches, return an empty array: []
    """
    
    try:
        response = model.models.generate_content(
            model='gemini-flash-latest',
            contents=prompt
        )
        text = response.text.strip()
        
        # Robustly extract JSON array using regex
        import re
        match = re.search(r'\[.*\]', text, re.DOTALL)
        if match:
            text = match.group(0)
        else:
            # Fallback if no brackets are found
            text = text.replace('```json', '').replace('```', '').strip()
            
        parsed_items = json.loads(text)
        return parsed_items
    except Exception as e:
        print(f"Gemini API Error during voice parsing: {str(e)}\nRaw Text: {text if 'text' in locals() else 'None'}")
        return {"error": f"Failed to parse order: {str(e)}"}
