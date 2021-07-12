const WebSocket = require('ws');
var receive = require('./modules/rabbit/receive');
var express = require('express');
var app = express();
app.use(express.json()); // Per parsare il json in entrata sulle POST
app.use(express.urlencoded({ // Da vedere
    extended: true
}));

app.use(express.static(__dirname + '/static'));

//app.get('/logs', );

const wss = new WebSocket.Server({
    port: 9998
});

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    console.log("Connessione Ws avviata.");
    receive.getLogs(ws);
});

var server = app.listen(8889, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('OnSat Control Panel listening at http://%s:%s', host, port);
});