window.addEventListener('load', async function () {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (!email || !password) {
        alert('Missing ID or access token. Please register.');
        window.location.href = '/register/';
        return;
    }
    try {
        const response = await fetch('/api/v1/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (response.ok || response.status === 200 || response.status === 304) {
            const data = await response.json();
            console.log('Response data:', data);
            localStorage.setItem('theme', data.theme);
        } else {
            clearLocalStorage()
            const errorText = await response.text();
            console.error('Server error:', errorText);
            alert('Authentication failed. Redirecting to registration.');
            window.location.href = '/register/';
        }
    } catch (error) {
        clearLocalStorage()
        console.error('Error during fetch:', error);
        alert('Network error occurred. Please try again later.');
        window.location.href = '/register/';
    }
});
function clearLocalStorage() {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
}