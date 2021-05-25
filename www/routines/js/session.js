function logout() {
    window.localStorage.removeItem('loggedin');
    window.open('./signin.html', '_self');
}

function checkIfLoggedin() {
    if (window.localStorage.loggedin) {
        //window.open('./index.html', '_self');
    }
}