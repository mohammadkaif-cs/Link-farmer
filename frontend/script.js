function updateNavbar() {
    const token = localStorage.getItem('token');
    const authLinkText = document.getElementById('auth-link-text');

    if (token) {
        // User is logged in
        authLinkText.textContent = 'LOGOUT';
        authLinkText.href = '#'; 
        authLinkText.onclick = function() {
            localStorage.removeItem('token'); 
            updateNavbar(); 
            alert('Logged out successfully!');
        };
    } else {
        // User is logged out
        authLinkText.textContent = 'LOGIN';
        authLinkText.href = 'login.html';
    }
}


window.onload = updateNavbar;
