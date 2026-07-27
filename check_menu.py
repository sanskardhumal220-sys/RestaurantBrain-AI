import requests
def check_menu():
    try:
        res = requests.get('http://localhost:5000/api/menu/items')
        print(f"Status: {res.status_code}")
        print("Menu Items:", res.json())
    except Exception as e:
        print("Error connecting to backend:", e)
if __name__ == '__main__':
    check_menu()
