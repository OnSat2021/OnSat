function logout() {
    window.localStorage.removeItem('loggedin');
    window.localStorage.removeItem('user_id');
    window.open('./signin.html', '_self');
}

function checkIfLoggedin() {
    if (window.localStorage.loggedin) {
        window.open('./index.html', '_self');
    }
}

function checkSession() {
    if (window.localStorage.loggedin && window.localStorage.user_id) {

    } else {
        logout();
    }
}