window.addEventListener('load', async function () {
    const id = localStorage.getItem('id');
    const accessToken = localStorage.getItem('accessToken');
    if (!id || !accessToken) {
        alert('Missing id or access token. Please register.');
        window.location.href = '/register/';
        return;
    }
    try {
        const response = await fetch('/api/v1/conect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, accessToken })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('id', data.id);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('email', data.email);
            localStorage.setItem('username', data.username);
            localStorage.setItem('name', data.name);
        } else {
            clearLocalStorage();
            window.location.href = '/register/';
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        clearLocalStorage();
        window.location.href = '/register/';
    }
});
function clearLocalStorage() {
    localStorage.removeItem('id');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('name');
}