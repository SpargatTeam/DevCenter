import requests

url = 'http://localhost:80/api/v1/register'
register_data = {
    'username': 'newuser',
    'name': 'New User',
    'password': 'password123'
}
response = requests.post(url, json=register_data)

if response.status_code == 201:
    print(f"Registration successful! Access Token: {response.json()['accessToken']}")
elif response.status_code == 400:
    print("Bad Request: All fields are required.")
elif response.status_code == 409:
    print("Conflict: Username already exists.")
else:
    print(f"Unexpected error: {response.status_code} - {response.text}")