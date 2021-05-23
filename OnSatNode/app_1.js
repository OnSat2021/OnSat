// https://expressjs.com/
// npm install express
require('dotenv').config();
var request = require('request');

const OK = {
    result: "ok"
}
const KO = {
    result: "ko"
}

var express = require('express');
var app = express();

app.get('/', function(req, res) {
    console.log("RICHIESTA ROOT");
    res.send('Sono il grandissimo Groot!!!');
});

app.get('/weather', function(req, res) {
    getWeather(res);
});

/*
// curl -X POST http://localhost:8888/prima_risorsa_post
app.post('/prima_risorsa_post', function (req, res) {
  res.send('sono la prima risorsa POST su questo server');
});*/


var server = app.listen(8888, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});




function getWeather(res) {
    console.log("RICHIESTA METEO");

    function wheather_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            /*console.log(info.list[0]);
            console.log(info.cnt);*/
            res.send(info);
        } else {
            res.send(KO);
        }
    }
    const city = "Roma";
    var options = {
        url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&cnt&appid=' + process.env.WHEATHER_KEY,
    }

    request.get(options, wheather_callback);
}