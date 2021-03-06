Vue.component('sign-in', {
    template: `
    <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
        <section-header title="OnSat" subtitle="Accedi con il tuo account Google"></section-header>
        <span class="absolute bottom-4 flex flex-row justify-center w-full">
            <flat-button class="mx-auto" label="Accedi con Google" mode="light" onclick="oauthSignIn()"></flat-button>
        </span>
    </div>
    `,
    mounted() {

    },
});

function oauthGetToken() {
    sendRequest('GET', '/google/oauth/get/token', null, res => {
        console.log(res);
    });
}

function oauthCreateToken(code) {
    const json = {
        'code': code
    };
    sendRequest('POST', '/google/oauth/token', json, res => {
        console.log(res);

        function verifyLogin(obj) {
            console.log(obj);
            if (!obj.error_code) {
                window.localStorage.loggedin = obj.result.loggedin;
                window.localStorage.user_id = obj.result.user_id;
                checkIfLoggedin();
            } else {
                app.alertPresent("Errore", obj.error_desc, 'Ok');
            }
        }

        sendRequest('POST', "/google-login", {
            "token": res.id_token
        }, verifyLogin);
    });
}

function oauthSignIn() {
    sendRequest('GET', '/google/oauth/login-url', null, res => {
        window.localStorage.setItem('state', res.state);
        window.open(res.url, "_self");
    });
}

window.addEventListener('DOMContentLoaded', (event) => {
    checkIfLoggedin();
    const params = getParams();
    console.log("Parametri ricevuti: ");
    console.log(params);
    if (params.code && params.state) {
        if (params.state == window.localStorage.state) {
            oauthCreateToken(params.code);
        }
    }

});