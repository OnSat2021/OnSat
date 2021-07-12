//var SERVER_NAME = 'https://onsat.ongroup.cloud';
var SERVER_NAME = "http://localhost:8888";

var app = new Vue({
    el: "#app",
    data: {
        DEBUG: true,

        /** LOGGEDIN **/
        loggedin: true,

        /** ROUTING **/
        currentRoute: window.location.pathname,

        /****/
        loader: {
            "message": "Caricamento in corso",
            "picture": "./src/loader.gif",
            "active": false
        },
        alert: {
            "message": "Alert",
            "body": "Descrizione",
            "button": null,
            "active": false,
            "on_ok": null,
            "ko_label": ''
        },
        modal: null,
        bikes: []
    },
    methods: {
        /** LOADER **/
        loaderPresent(message = "Caricamento in corso") {
            this.print("Presenta Loader");
            this.loader.message = message;
            this.loader.active = true;
        },
        loaderDismiss() {
            let self = this;
            setTimeout(function () {
                self.print("Dismetti Loader");
                self.loader.active = false;
            }, 500);
        },
        /** ALERT **/
        alertPresent(message, body, button = null, json = {}) {
            this.print("Presenta Alert");
            this.alert.message = message;
            this.alert.body = body;
            this.alert.button = button;
            this.alert.active = true;
            if (json.ok_function) {
                this.alert.on_ok = json.ok_function;
            }
            if (json.ko_label) {
                this.alert.ko_label = json.ko_label;
            }
        },
        alertDismiss() {
            this.print("Dismetti Alert");
            this.alert.active = false;
            this.alert.button = null;
            this.alert.on_ok = null;
            this.alert.ko_label = '';
        },
        /** ROUTINES **/
        print(log) {
            if (this.DEBUG) console.log(log);
        },


        /** ROUTING **/
        checkRoute(path) {
            return path == this.currentRoute;
        }
    },
    computed: {

        /** ROUTING **/
        /* ViewComponent() {
             return routes[this.currentRoute] || NotFound
         },*/

        /** LOADER, ALERT, MODAL**/
        backdrop() {
            return !(this.loader.active == false && this.alert.active == false && this.modal == null);
        }
    },
    mounted() {
        this.currentRoute = "/";
        setTimeout(() => {
            $('#splashscreen').addClass('opacity-0');
            $('#splashscreen').removeClass('opacity-100');
            setTimeout(() => {
                $('#splashscreen').hide();
            }, 500);
        }, 1500);
    }
    /*
        render(h) {
            return h(this.ViewComponent)
        }*/
});


function onErrorDefault(e) {
    console.warn("Errore xhr: " + e);
}

function onSuccessDefault(obj) {
    console.log(obj);
}

function sendRequest(mode = 'POST', relative_path, json = {}, onSuccess = onSuccessDefault, onError = onErrorDefault) {
    var xhr = new XMLHttpRequest();
    let url = "";
    url += SERVER_NAME;
    url += relative_path;

    if (mode == 'GET') {
        url += '?' + serialize(json);
    }

    try {
        app.loaderPresent();
    } catch (e) {}

    xhr.open(mode, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        let reply = xhr.responseText;
        try {
            app.loaderDismiss();
        } catch (e) {}

        try {
            var obj = JSON.parse(reply);
            console.log(obj);
        } catch (error) {
            console.log(reply);
            return onError(error);
        }
        return onSuccess(obj);
    };
    xhr.send(JSON.stringify(json));
}

function getParams() {
    var args = new Array();
    var vars = (window.location.href.split("?"))[1];
    if (vars) {
        var strings = vars.split('&');
        for (elem in strings) {
            var parts = strings[elem].split('=');
            args[unescape(parts[0])] = unescape(parts[1]);
        }
    }
    return args;
}


function serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}


function switchTheme(theme = null) {
    if (theme != null) window.localStorage.theme = theme;
    let dark = '#170F24';
    let light = '#2F263D';
    if (window.localStorage.hasOwnProperty('theme')) {
        switch (window.localStorage.theme) {
            case 'purple':
                light = '#3E276A';
                dark = '#270F53';
                break;
            case 'green':
                light = '#2D3D26';
                dark = '#12240F';
                break;
            case 'blue':
                light = '#263A3D';
                dark = '#0F2124';
                break;
            case 'red':
                light = '#3D2626';
                dark = '#240F0F';
                break;

        }
    }

    $(':root').css('--theme-dark', dark);
    $(':root').css('--theme-light', light);
}