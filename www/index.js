var app = new Vue({
    el: "#app",
    data: {
        DEBUG: false,
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
            this.print("Dismetti Loader");
            this.loader.active = false;
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
        }
    },
    computed: {
        /** LOADER, ALERT, MODAL**/
        backdrop() {
            return !(this.loader.active == false && this.alert == null && this.modal == null);
        }
    }
});