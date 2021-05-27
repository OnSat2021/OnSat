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
            "active": false
        },
        modal: null
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
            }, 800);
        },
        /** ALERT **/
        alertPresent(message, body, button = null) {
            this.print("Presenta Alert");
            this.alert.message = message;
            this.alert.body = body;
            this.alert.button = button;
            this.alert.active = true;
        },
        alertDismiss() {
            this.print("Dismetti Alert");
            this.alert.active = false;
            this.alert.button = null;
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
        this.currentRoute = "/paths";
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
    let url = 'https://onsat.ongroup.cloud' + relative_path;
    //url = 'http://localhost:8888' + relative_path;
    xhr.open(mode, url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        let reply = xhr.responseText;
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