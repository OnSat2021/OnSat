const emitLog = require('../rabbit/emit');
var request = require('request');

module.exports = {
    getWeather
}

function getWeather(req, res) {
    emitLog.sendLog("info", "RICHIESTA METEO");

    function wheather_callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            /*emitLog.sendLog("info", info.list[0]);
            emitLog.sendLog("info", info.cnt);*/
            res.send(info);
        } else {
            res.send({
                error_code: 1,
                error_desc: "Nessun dato trovato"
            });
        }
    }
    const city = "Roma";
    var options = {
        url: 'https://api.openweathermap.org/data/2.5/forecast?zip=' + '00165,IT' + '&units=metric&cnt&lang=it&appid=' + process.env.WHEATHER_KEY,
    }
    request.get(options, wheather_callback);
}