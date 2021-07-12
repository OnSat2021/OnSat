var app;
document - addEventListener('DOMContentLoaded', function () {
    app = new Vue({
        el: '#controlpanel',
        data: {
            messages: [],
            connectionStatus: false
        },
        watch: {
            connectionStatus: function (val) {
                console.log("Nuovo stato della connessione: " + (app.connectionStatus ? "APERTA" : "CHIUSA"));
            },
            messages(val) {
                var scroll = $('#message-container');
                scroll.animate({
                    scrollTop: 99999999
                }, 0);
            }
        },
        methods: {
            connectWS() {
                var ws = new WebSocket("ws://localhost:9998/");

                ws.onopen = function () {
                    app.connectionStatus = true;
                };

                ws.onmessage = function (evt) {
                    var received_msg = evt.data;
                    console.log(received_msg);
                    var msg = JSON.parse(received_msg);

                    const today = new Date();
                    const dd = String(today.getDate()).padStart(2, '0');
                    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    const yyyy = today.getFullYear();
                    const date = mm + '/' + dd + '/' + yyyy + ' <br>' + String(today.getHours()).padStart(2, '0') + ":" + String(today.getMinutes()).padStart(2, '0') + ":" + String(today.getSeconds()).padStart(2, '0');
                    msg.timestamp = date;
                    console.log(msg.timestamp);

                    app.messages.unshift(msg);
                    //app.messages.push(msg);
                };

                ws.onclose = function () {
                    app.connectionStatus = false;
                };

                window.onbeforeunload = function (event) {
                    //socket.close();
                };
            }

        },
        mounted() {
            this.connectWS();
        }
    })
});





Vue.component('log-message', {
    props: ['message'],
    data() {
        return {
            date: null
        }
    },
    computed: {
        textColor() {
            switch (this.message.type) {
                case 'info':
                    return 'text-white';
                case 'warning':
                    return 'text-yellow-300';
                case 'error':
                    return 'text-red-600';
                default:
                    return 'text-grey-600';
            }
        }
    },
    template: /* template */ `
        <div class="relative w-full px-6 p-2 flex flex-row justify-start">
            <span class="material-icons text-white text-lg font-bold mr-4">chevron_right</span>
            <span class=" flex flex-col justify-start text-green-300 text-xs font-normal text-left pt-1 leading-1 mr-4" v-html="message.timestamp"></span>
            <span class=" flex flex-col justify-start text-white text-xs font-normal text-left w-full pt-1 leading-1" :class="textColor">{{message.body}}</span>
        </div>
    `
});

Vue.component('connection-status', {
    props: ['status'],
    computed: {
        statusColor() {
            switch (this.status) {
                case true:
                    return 'bg-green-500';
                case false:
                    return 'bg-red-500';
                default:
                    return 'bg-grey-600';
            }
        },
        label() {
            return this.status ? "Connessione Aperta" : "Connessione Chiusa";
        }
    },
    methods: {
        reset() {
            app.messages = [];
        },
        reconnect() {
            app.connectWS();
        }
    },
    template: /* template */ `
        <div class="fixed top-12 left-0 flex flex-row justify-center w-full">
        <span class="w-3/5 flex flex-row justify-between h-24 mx-auto">
            <span class="flex flex-row justify-start h-full mr-6">
                <span class="flex flex-col justify-center h-full"><span class="rounded-full mr-6" :class="statusColor" style="height: 42px; width: 42px;"/></span>
                <span class="flex flex-col justify-start text-black text-lg font-normal text-left pt-1 leading-1 flex flex-col justify-center h-full">{{label}}</span>
            </span>
            <span class="flex flex-row">
                <span class="flex flex-col justify-center h-full"><span class="rounded-xl bg-gray-600 text-white text-xs p-2 px-4 flex flex-col justify-center h-12 mx-4 cursor-pointer" @click="reset">Pulisci Console</span></span>
                <span v-if="!status" class="flex flex-col justify-center h-full"><span class="rounded-xl bg-gray-600 text-white text-xs p-2 px-4 flex flex-col justify-center h-12 mx-4 cursor-pointer" @click="reconnect">Riconnetti</span></span>
            </span>
        </span>
        </div>
    `
});