import requests

url = 'http://localhost:80/api/v1/login' 
login_data = {
    'username': 'newuser',
    'password': 'password123'
}
response = requests.post(url, json=login_data)

if response.status_code == 200:
    print(f"Login successful! Access Token: {response.json()['accessToken']}")
elif response.status_code == 400:
    print("Bad Request: Username and password are required.")
elif response.status_code == 401:
    print("Unauthorized: Invalid username or password.")
else:
    print(f"Unexpected error: {response.status_code} - {response.text}")