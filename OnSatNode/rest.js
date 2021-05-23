









//const util = require('util')
require('dotenv').config()
    //serve a configurare quali parametri vanno nascosti, in questo caso l'api key
    //le specifiche sono contenute nel file .env
    //in questo caso .env contiene WHEATHER_KEY, che andrò a chiamare con process.env.WHEATHER_KEY

const ERROR_OBJ = {
    error_code: 1,
    error_desc: "ko"
};


var http = require('http');
var request = require('request');

// http://api.openweathermap.org/data/2.5/weather?q=Rome&appid=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
function wheather_request(city) {
    var options = {
        url: 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&cnt&appid=' + process.env.WHEATHER_KEY,
    }
    request.get(options, wheather_callback);
}

function wheather_callback(error, response, body) {
    return ERROR_OBJ;
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        /*console.log(info.list[0]);
        console.log(info.cnt);*/
        return info;
    }
}


//We need a function which handles requests and send response

function handleRequest(request, response) {
    console.log("Connessione ricevuta");
    wheather_request("Roma")
    response.end(ERROR_OBJ);
}



const PORT = 8080;

//Create a server
var server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function() {
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});