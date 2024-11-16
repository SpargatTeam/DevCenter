document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('name').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const registerData = {
        email: email,
        username: name,
        name: name,
        password: password
    };
    const response = await fetch('/api/v1/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerData)
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('id', data.id);
        localStorage.setItem('accessToken', data.accessToken);
        window.location.href = '/';
    } else if (response.status === 400) {
        alert('Bad Request: All fields are required.');
    } else if (response.status === 409) {
        alert('Conflict: Username already exists.');
    } else {
        alert(`Unexpected error: ${response.status} - ${await response.text()}`);
    }
});