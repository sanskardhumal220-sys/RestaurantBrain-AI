import requests
import json

base_url = 'http://127.0.0.1:5000/api'

# 1. Login to get token
# Using the credentials the user is probably using
r = requests.post(f"{base_url}/auth/login", json={'email': 'admin@test.com', 'password': 'password123'})
if r.status_code != 200:
    print("Login failed:", r.status_code, r.text)
    # try to register it
    r = requests.post(f"{base_url}/auth/register", json={
        'full_name': 'Admin', 'email': 'admin@test.com', 'password': 'password123', 'phone': '999', 'role': 'Restaurant Owner'
    })
    print("Register:", r.status_code, r.text)
    r = requests.post(f"{base_url}/auth/login", json={'email': 'admin@test.com', 'password': 'password123'})

if r.status_code == 200:
    token = r.json().get('token')
    if not token:
        token = r.json().get('access_token')
    
    print("Got token")
    
    # 2. Add category
    r_cat = requests.post(
        f"{base_url}/menu/categories", 
        json={'name': 'Test Category', 'description': 'Testing'}, 
        headers={'Authorization': f'Bearer {token}'}
    )
    print("Add category response:", r_cat.status_code, r_cat.text)
