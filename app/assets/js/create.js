const fetch = require('node-fetch');
async function createFolder(accessToken, folderName, userId) {
    const url = "http://localhost:80/create/shared";
    const headers = {
        "Content-Type": "application/json"
    };
    const payload = {
        accessToken: accessToken,
        folderName: folderName,
        id: userId
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
        if (response.status === 201) {
            const data = await response.text();
            console.log(`Success: ${data}`);
        } else if (response.status === 400) {
            console.log('Error: Access token, folder name, and user ID are required.');
        } else if (response.status === 401) {
            console.log('Error: Invalid access token or user ID.');
        } else if (response.status === 500) {
            console.log('Error: An error occurred while creating the folder.');
        } else {
            const errorText = await response.text();
            console.log(`Unexpected error: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.log(`An error occurred while making the request: ${error}`);
    }
}
const accessToken = "tokenaro-M9KBkenjmaSa0wmOV0CkuU3oZmX2xcLxQpyeRngR";
const folderName = "test123";
const userId = 1;
createFolder(accessToken, folderName, userId);