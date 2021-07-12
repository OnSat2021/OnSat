var express = require('express');
var app = express();
app.use(express.json()); // Per parsare il json in entrata sulle POST
app.use(express.urlencoded({ // Da vedere
    extended: true
}));

app.use('/', express.static(__dirname + '/static/www'));

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Client ONSAT http://%s:%s', host, port);
});