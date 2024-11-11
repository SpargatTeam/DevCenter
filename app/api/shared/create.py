import requests

def create_folder(access_token, folder_name, user_id):
    url = "http://localhost:80/create/shared"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "accessToken": access_token,
        "folderName": folder_name,
        "id": user_id
    }
    try:
        response = requests.post(url, json=payload, headers=headers)
        if response.status_code == 201:
            print(f'Success: {response.text}')
        elif response.status_code == 400:
            print('Error: Access token, folder name, and user ID are required.')
        elif response.status_code == 401:
            print('Error: Invalid access token or user ID.')
        elif response.status_code == 500:
            print('Error: An error occurred while creating the folder.')
        else:
            print(f'Unexpected error: {response.status_code} - {response.text}')
    except requests.exceptions.RequestException as e:
        print(f'An error occurred while making the request: {e}')
if __name__ == "__main__":
    access_token = "tokenaro-M9KBkenjmaSa0wmOV0CkuU3oZmX2xcLxQpyeRngR" 
    folder_name = "test123" 
    user_id = 1
    create_folder(access_token, folder_name, user_id)