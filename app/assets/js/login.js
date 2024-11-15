document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/api/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem('id', data.id);
        localStorage.setItem('accessToken', data.accessToken);
        window.location.href = '/';
    } else if (response.status === 401) {
        alert('Unauthorized: Invalid username or password.');
    } else {
        alert(`Unexpected error: ${response.status}`);
    }
});