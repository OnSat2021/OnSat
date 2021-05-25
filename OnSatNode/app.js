// https://expressjs.com/
// npm install express
require('dotenv').config();
var request = require('request');

var express = require('express');
var app = express();
app.use(express.json()); // Per parsare il json in entrata sulle POST
app.use(express.urlencoded({ // Da vedere
    extended: true
}));








// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    /*
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
*/
    // Pass to next layer of middleware
    next();
});



app.get('/', function (req, res) {
    console.log("RICHIESTA ROOT");
    res.send('Sono il grandissimo Groot!!!');
});

app.get('/weather', function (req, res) {
    getWeather(res);
});

app.post('/google-login', function (req, res) {
    //res.send(req.body);

    let body = req.body;
    let token = body.token;

    const {
        OAuth2Client
    } = require('google-auth-library');
    const client = new OAuth2Client(process.env.CLIENT_ID);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        const email = payload['email'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];

        let response = {
            'error_code': 1,
            'error_desc': 'Login con Google fallito'
        };

        const loggedin = true;

        if (loggedin) {
            response = {
                'error_code': 0,
                'error_desc': 'Login con Google riuscito',
                'response': {
                    'loggedin': loggedin,
                    'user': payload
                }
            };
        }

        res.send(response);
    }
    verify().catch(console.error);

});

const redirect_uri = 'https://onsat.ongroup.cloud/client/www/signin.html';
app.get('/google/oauth/login-url', function (req, res) {
    const state = makeid(32);
    const response = {
        'url': 'https://accounts.google.com/o/oauth2/v2/auth?' +
            'response_type=code' +
            '&client_id=' + process.env.CLIENT_ID +
            '&scope=openid%20email%20https://www.googleapis.com/auth/userinfo.profile' +
            '&redirect_uri=' + redirect_uri +
            '&state=' + state +
            '&nonce=0394852-3190485-2490358',
        'state': state
    };
    res.send(response);
});




function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}

app.post('/google/oauth/token', function (req, res) {

    var formData = {
        code: req.body.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    }

    request.post({
        url: 'https://www.googleapis.com/oauth2/v4/token',
        form: formData
    }, function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        var info = JSON.parse(body);
        a_t = info.access_token;
        res.send(info);
    });

});

var a_t;

app.get('/google/oauth/get/token', function (req, res) {
    const json = {
        "access_token": a_t
    };
    res.send(json);
});

/*
// curl -X POST http://localhost:8888/prima_risorsa_post
app.post('/prima_risorsa_post', function (req, res) {
  res.send('sono la prima risorsa POST su questo server');
});*/


var server = app.listen(8888, function () {
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









//MySQL
var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/data/products', function (req, res) {
    const query = 'SELECT * FROM product';
    con.query(query, function (err, result) {
        let json;
        if (err) {
            json = {
                'error_code': 1,
                'error_desc': err.message
            }
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok',
                "result": result
            };
        }
        res.send(json);
    });
});