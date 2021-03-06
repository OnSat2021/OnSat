require('dotenv').config();

const emitLog = require('./modules/rabbit/emit');
//const google = require('./modules/google-oauth/oauth');
const weather = require('./modules/weather/weather');
const calendar = require('./modules/google-api/calendar');

var request = require('request');

var express = require('express');
var app = express();
app.use(express.json()); // Per parsare il json in entrata sulle POST
app.use(express.urlencoded({ // Da vedere
    extended: true
}));

app.get('/test', function (req, res) {



});


var mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
con.connect(function (err) {
    if (err) throw err;
    emitLog.sendLog("info", "Connected!");
});

//const SERVER_PATH = 'file:///C:/Users/filip/Documents/GitHub/OnSat/';
//const SERVER_PATH = 'https://onsat.ongroup.cloud/client/';
const SERVER_PATH = 'http:localhost:8080/';

//app.use('/static/www', express.static(__dirname + '/applicazione/www'));

var server = app.listen(8888, function () {
    var host = server.address().address;
    var port = server.address().port;

    emitLog.sendLog("info", 'Example app listening at http://%s:%s', host, port);
});

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', '*');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
    emitLog.sendLog("info", "RICHIESTA ROOT");
    res.send('Sono il grandissimo Groot!!!');
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

// Weather
app.get('/weather', weather.getWeather);

// GOOGLE LOGIN

var a_t;
const redirect_uri = 'https://on-e.it';
app.post('/google-login', function login(req, res) {
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
        const google_id = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];

        let json = {
            'error_code': 1,
            'error_desc': 'Login con Google fallito'
        };

        const query = 'SELECT id FROM user WHERE google_id=?';
        con.query(query, [google_id], function (err, result) {
            if (err) {
                json = {
                    'error_code': 1,
                    'error_desc': err.message
                };
                res.send(json);
            } else {
                if (result.length > 0) {
                    json = {
                        "error_code": 0,
                        "error_desc": 'ok',
                        "result": {
                            'loggedin': true,
                            'user_id': result[0].id
                        }
                    };
                    res.send(json);
                } else {
                    const user_id = "user_" + makeid(15);
                    const query = 'INSERT INTO user (id, name, surname, username, email, google_id) VALUES (?,?,?,?,?,?)';
                    con.query(query, [user_id, payload.given_name, payload.family_name, payload.email, payload.email, payload.sub], function (err, result) {
                        if (err) {
                            json = {
                                'error_code': 1,
                                'error_desc': err.message
                            }
                        } else {
                            json = {
                                "error_code": 0,
                                "error_desc": 'ok',
                                "result": {
                                    'loggedin': true,
                                    'user_id': user_id
                                }
                            };
                        }
                        res.send(json);
                    });
                }
            }

        });


    }

    verify().catch(console.error);

});


app.get('/google/oauth/login-url', function loginUrl(req, res) {
    const state = makeid(32);
    const response = {
        'url': 'https://accounts.google.com/o/oauth2/v2/auth?' +
            'response_type=code' +
            '&client_id=' + process.env.CLIENT_ID +
            '&scope=openid%20email%20https://www.googleapis.com/auth/userinfo.profile%20https://www.googleapis.com/auth/calendar' +
            '&redirect_uri=' + redirect_uri +
            '&state=' + state +
            '&nonce=0394852-3190485-2490358',
        'state': state
    };
    res.send(response);
});


app.post('/google/oauth/token',
    function token(req, res) {

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
app.get('/google/oauth/get/token', function getToken(req, res) {
    const json = {
        "access_token": a_t
    };
    res.send(json);
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





//APIs
//docker run -dp 3000:3000 getting-started

function inoltra_errore(res, error_desc, error_code = 1) {
    const json = {
        error_code: error_code,
        error_desc: error_desc
    };
    res.send(json);
}

//Users
app.get('/user', function (req, res) {
    //res.send(req.body);
    let body = req.query;
    emitLog.sendLog("info", body);
    let json;

    if (body.user_id) {
        let user_id = body.user_id;
        const query = 'SELECT id, name, surname, username, google_id, cellphone, email, address FROM user WHERE id=? LIMIT 1';
        con.query(query, [user_id], function (err, result) {
            if (err) {
                inoltra_errore(res, err.message);
            } else {
                if (result.length > 0) {
                    json = {
                        "error_code": 0,
                        "error_desc": 'ok',
                        "result": result[0]
                    };
                    res.send(json);
                } else {
                    inoltra_errore(res, 'Nessun utente trovato per user_id: ' + user_id);
                }
            }
        });
    } else {
        inoltra_errore(res, 'Campo user_id obbligatorio');
    }
});

//Bikes
app.get('/bike', function (req, res) {
    //res.send(req.body);
    let body = req.query;
    emitLog.sendLog("info", body);
    let json;

    let where = 'WHERE 1';
    let ok = false;

    if (body.bike_id) {
        where += " AND b.id='" + body.bike_id + "'";
        ok = true;
    }

    if (body.user_id) {
        where += " AND u.id='" + body.user_id + "'";
        ok = true;
    }

    if (!ok) {
        inoltra_errore(res, 'Devi inserire almeno uno tra user_id e bike_id');
        return;
    }

    let query = 'SELECT b.id, u.id as user_id, m.id AS model_id, m.name AS model_name, m.picture AS model_picture, m.battery_voltage AS model_battery_voltage, b.name, b.current_lat, b.current_lon, b.imei_tracker, b.battery_level ' +
        'FROM bike b JOIN user u ON b.user_id = u._id JOIN model m ON b.model_id = m._id ' + where;

    con.query(query, function (err, result) {
        if (err) {
            inoltra_errore(res, err.message);
            return;
        } else {
            if (result.length > 0) {
                let bikes = [];
                result.forEach(row => {
                    bike = {
                        id: row.id,
                        user_id: row.user_id,
                        model: {
                            id: row.model_id,
                            name: row.model_name,
                            picture: row.model_picture,
                            battery_voltage: row.model_battery_voltage
                        },
                        name: row.name,
                        current_lat: row.current_lat,
                        current_lon: row.current_lon,
                        imei_tracker: row.imei_tracker,
                        battery_level: row.battery_level
                    }
                    bikes.push(bike);
                });
                json = {
                    "error_code": 0,
                    "error_desc": 'ok',
                    "result": bikes
                };
                res.send(json);
            } else {
                inoltra_errore(res, 'Nessun bici trovata per la ricerca corrente');
                return;
            }
        }
    });

});
app.get('/model', function (req, res) {
    //res.send(req.body);
    let query = 'SELECT id, name, picture, battery_voltage FROM model WHERE 1';

    con.query(query, function (err, result) {
        if (err) {
            inoltra_errore(res, err.message);
            return;
        } else {
            if (result.length > 0) {
                let models = [];
                result.forEach(row => {
                    model = {
                        id: row.id,
                        name: row.name,
                        picture: row.picture,
                        battery_voltage: row.battery_voltage
                    }
                    models.push(model);
                });
                json = {
                    "error_code": 0,
                    "error_desc": 'ok',
                    "result": models
                };
                res.send(json);
            } else {
                inoltra_errore(res, 'Nessun modello trovato per la ricerca corrente');
                return;
            }
        }
    });

});



function esegui_query(query, args = []) {
    return new Promise(function (resolve, reject) {
        con.query(query, args, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        });
    });
}

function getPoi(_id = 0) {
    return new Promise(function (resolve, reject) {
        if (_id == 0)
            reject({
                message: 'Errore interno recuper informazioni.'
            });
        query = 'SELECT id, name, lat, lon, description, picture FROM poi WHERE _id=? LIMIT 1';
        esegui_query(query, [_id]).then(result => {
            resolve(result[0]);
        }).catch(err => {
            reject(err);
        });
    });

}

function getIdealFor(_id = 0) {
    return new Promise(function (resolve, reject) {
        if (_id == 0)
            reject({
                message: 'Errore interno recuper informazioni.'
            });
        query = 'SELECT level, description, icon_color FROM ideal_for WHERE _id=? LIMIT 1';
        esegui_query(query, [_id]).then(result => {
            resolve(result[0]);
        }).catch(err => {
            reject(err);
        });
    });
}

app.get('/route', function (req, res) {
    //res.send(req.body);
    let query = 'SELECT id, name, description, start_poi_id, end_poi_id, ideal_for_id, length, duration, picture FROM route WHERE 1 ';
    esegui_query(query).then(result => {
        const count = result.length;
        if (result.length > 0) {
            let routes = [];
            let prom = new Promise((resolve, reject) => {
                result.forEach(row => {
                    getPoi(row.start_poi_id).then(result => {
                        var start_poi = result;
                        getPoi(row.end_poi_id).then(result => {
                            var end_poi = result;
                            getIdealFor(row.ideal_for_id).then(result => {
                                var ideal_for = result;
                                //emitLog.sendLog("info", start_poi, end_poi, ideal_for);
                                route = {
                                    id: row.id,
                                    name: row.name,
                                    description: row.description,
                                    start_poi: start_poi,
                                    end_poi: end_poi,
                                    ideal_for: ideal_for,
                                    length: row.length,
                                    duration: row.duration,
                                    picture: row.picture,

                                }
                                routes.push(route);
                                if (routes.length == count) {
                                    json = {
                                        "error_code": 0,
                                        "error_desc": 'ok',
                                        "result": routes
                                    };
                                    res.send(json);
                                }
                            });;
                        });
                    });
                });
            });
        } else {
            inoltra_errore(res, 'Nessun itinerario trovato per la ricerca corrente');
        }
    }).catch(err => {
        inoltra_errore(res, err.message);
    })
});






app.post('/bike', function (req, res) {
    //res.send(req.body);
    let body = req.body;
    emitLog.sendLog("info", body);
    let json;

    if (body.user_id && body.user_id != "") {
        var user_id = body.user_id;
    } else {
        inoltra_errore(res, 'Il campo user_id non pu?? essere vuoto');
        return;
    }

    if (body.name && body.name != "") {
        var name = body.name;
    } else {
        inoltra_errore(res, 'Il campo nome non pu?? essere vuoto');
        return;
    }

    if (body.imei && body.imei != "") {
        var imei = body.imei;
    } else {
        inoltra_errore(res, 'Il campo IMEI non pu?? essere vuoto');
        return;
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    let current_lat = parseFloat(getRandomArbitrary(41.82, 41.9)).toFixed(5);
    let current_lon = parseFloat(getRandomArbitrary(12.4, 12.5)).toFixed(5);
    let model_id = body.model_id;
    let battery_level = parseInt(getRandomArbitrary(25, 100));

    if (body.bike_id && body.bike_id != "") {
        var bike_id = body.bike_id;
        var query = 'UPDATE bike SET name=?, model_id=(SELECT _id FROM model WHERE id=? LIMIT 1), current_lat=?, current_lon=?, imei_tracker=?, battery_level=? WHERE id=?';
        var data = [name, model_id, current_lat, current_lon, imei, battery_level, bike_id];
    } else {
        var bike_id = 'bike_' + makeid(15);
        var query = 'INSERT INTO bike (id, name, user_id, model_id, current_lat, current_lon, imei_tracker, battery_level) VALUES (?, ?,(SELECT _id FROM user WHERE id=? LIMIT 1), (SELECT _id FROM model WHERE id=? LIMIT 1), ?, ?, ?, ?)';
        var data = [bike_id, name, user_id, model_id, current_lat, current_lon, imei, battery_level];
    }

    emitLog.sendLog("info", query);

    con.query(query, data, function (err, result) {
        if (err) {
            inoltra_errore(res, err.message);
            return;
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok'
            };
            res.send(json);
        }
    });
});

app.delete('/bike', function (req, res) {
    //res.send(req.body);
    let body = req.body;
    emitLog.sendLog("info", body);
    let json;

    if (body.bike_id && body.bike_id != "") {
        var bike_id = body.bike_id;
    } else {
        inoltra_errore(res, 'Il campo user_id non pu?? essere vuoto');
        return;
    }

    let query = 'DELETE FROM bike WHERE id=?';

    emitLog.sendLog("info", query);

    con.query(query, [bike_id], function (err, result) {
        if (err) {
            inoltra_errore(res, err.message);
            return;
        } else {
            json = {
                "error_code": 0,
                "error_desc": 'ok'
            };
            res.send(json);
        }
    });

});




//STRIPE

function newOrder(json) {


    var today = new Date();
    const padding = parseInt((Math.random() * 10) + 3);
    today.setDate(today.getDate() + padding);
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    const delivery_day = yyyy + "-" + mm + "-" + dd;

    const description = {
        summary: "La tua consegna di " + json.quantity + "x " + json.price_data.product_data.name,
        address: json.price_data.product_data.metadata.address,
        description: "Ti consegneremo in giornata il tuo articolo, grazie. " + json.price_data.product_data.description,
        start: delivery_day + "T09:00:00+02:00",
        end: delivery_day + "T18:00:00+02:00",
        email: json.email
    }


    calendar.listCalendars(a_t).then(calendar_response => {
        emitLog.sendLog('warning', calendar_response);
        calendar.createEvent(a_t, calendar_response.calendar_id, description);
    });

    const query = 'INSERT INTO onsat_admin.order (id, shipping_address, fiscal_code, user_id, product_id, quantity, status_id) VALUES (?, ?, ?, (SELECT _id FROM user WHERE id=? LIMIT 1), (SELECT _id FROM product WHERE id=? LIMIT 1), ?, ?)';
    const order_id = 'order_' + makeid(15);

    esegui_query(query, [order_id, json.price_data.product_data.metadata.address, json.price_data.product_data.metadata.fiscal_code, json.price_data.product_data.metadata.user_id, json.price_data.product_data.metadata.product_id, json.quantity, 1]).catch(err => {
        emitLog.sendLog("info", err);
    });
}


const stripe = require('stripe')('sk_test_AQ2g55RQvS6uKboqAHSHL2m800l7e8oUAY')


app.post('/stripe-payment-intent', async (req, res) => {
    let body = req.body;

    emitLog.sendLog("info", body);

    if (body.name && body.name != "") {
        var name = body.user_id;
    } else {
        inoltra_errore(res, 'Il campo Nominativo non pu?? essere vuoto');
        return;
    }

    if (body.cf && body.cf != "") {
        var cf = body.cf;
    } else {
        inoltra_errore(res, 'Il campo Codice Fiscale non pu?? essere vuoto');
        return;
    }

    if (body.address && body.address != "") {
        var address = body.address;
    } else {
        inoltra_errore(res, 'Il campo Indirizzo non pu?? essere vuoto');
        return;
    }

    if (body.user_id) {
        let user_id = body.user_id;
        const query = 'SELECT id, name, surname, username, google_id, cellphone, email, address FROM user WHERE id=? LIMIT 1';

        esegui_query(query, [user_id]).then(async function (result) {
            email = result[0].email

            let cart = body.cart;
            emitLog.sendLog("info", cart);

            var amount = 0;

            let line_items = [];
            cart.forEach(item => {
                const unit_amount = parseFloat(item.product.price).toFixed(2);
                let json = {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: item.product.name,
                            description: item.product.name,
                            images: [item.product.picture],
                            metadata: {
                                product_id: item.product.id,
                                user_id: user_id,
                                address: address,
                                fiscal_code: cf
                            }
                        },
                        unit_amount: unit_amount,
                    },
                    quantity: item.quantity,
                };

                amount += unit_amount * item.quantity;

                json.email = email;
                newOrder(json);

                line_items.push(json);
            });


            amount = parseFloat(amount * 100).toFixed(0);

            /*const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: line_items,
                customer_email: email,
                mode: 'payment',
                success_url: 'https://onsat.ongroup.cloud/client/www/index.html?paymentStatus=success',
                cancel_url: 'https://onsat.ongroup.cloud/client/www/index.html?paymentStatus=failed',
            });*/
            try {

                var paymentIntent = await stripe.paymentIntents.create({
                    payment_method_types: ['card'],
                    amount: amount,
                    currency: 'eur'
                });
            } catch (err) {
                inoltra_errore(res, 'Errore Stripe: ' + err.message);
            }

            res.json({
                error_code: 0,
                error_desc: 'ok',
                result: {
                    client_secret: paymentIntent.client_secret
                }
            });

        });
    } else {
        inoltra_errore(res, 'Campo user_id obbligatorio');
        return;
    }
});

app.post('/create-checkout-session', async (req, res) => {
    let body = req.body;

    if (body.user_id) {
        let user_id = body.user_id;
        const query = 'SELECT id, name, surname, username, google_id, cellphone, email, address FROM user WHERE id=? LIMIT 1';

        esegui_query(query, [user_id]).then(async function (result) {
            email = result[0].email

            let cart = body.cart;
            emitLog.sendLog("info", cart);

            let line_items = [];
            cart.forEach(item => {
                let json = {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: item.product.name,
                            description: item.product.name,
                            images: [item.product.picture],
                            metadata: {
                                product_id: item.product.id,
                                user_id: user_id
                            }
                        },
                        unit_amount: Math.round(item.product.price * 100),
                    },
                    quantity: item.quantity,
                };

                newOrder(json);

                line_items.push(json);
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: line_items,
                customer_email: email,
                mode: 'payment',
                success_url: SERVER_PATH + 'www/index.html?paymentStatus=success',
                cancel_url: SERVER_PATH + 'www/index.html?paymentStatus=failed',
            });

            res.json({
                error_code: 0,
                error_desc: 'ok',
                result: {
                    session_id: session.id
                }
            });

        });
    } else {
        inoltra_errore(res, 'Campo user_id obbligatorio');
        return;
    }
});





//Orders
app.get('/order', function (req, res) {
    //res.send(req.body);
    let body = req.query;
    emitLog.sendLog("info", body);
    let json;

    let where = 'WHERE 1';
    let ok = false;

    if (body.order_id) {
        where += " AND order.id='" + body.order_id + "'";
        ok = true;
    }

    if (body.user_id) {
        where += " AND u.id='" + body.user_id + "'";
        ok = true;
    }

    if (!ok) {
        inoltra_errore(res, 'Devi inserire almeno uno tra user_id e order_id');
        return;
    }

    let query = 'SELECT o.id, u.id as user_id, shipping_address, fiscal_code, product_id, quantity, status_id, timestamp ' +
        'FROM onsat_admin.order o JOIN user u ON o.user_id = u._id ' + where + ' ORDER BY o._id DESC';
    con.query(query, function (err, result) {
        if (err) {
            inoltra_errore(res, err.message);
            return;
        } else {
            emitLog.sendLog("info", result);
            if (result.length > 0) {
                let orders = [];
                let count = result.length;
                result.forEach(row => {

                    query = 'SELECT code, name, label FROM status WHERE _id=?'
                    esegui_query(query, [row.status_id]).then(
                        status => {
                            query = 'SELECT id, name, description, price, available, picture FROM product WHERE _id=?';
                            esegui_query(query, [row.product_id]).then(
                                product => {
                                    order = {
                                        id: row.id,
                                        user_id: row.user_id,
                                        product: product[0],
                                        shipping_address: row.shipping_address,
                                        fiscal_code: row.fiscal_code,
                                        quantity: row.quantity,
                                        status: status[0],
                                        timestamp: row.timestamp
                                    }
                                    orders.push(order);
                                    if (orders.length == count) {
                                        json = {
                                            "error_code": 0,
                                            "error_desc": 'ok',
                                            "result": orders
                                        };
                                        res.send(json);
                                    }
                                }
                            ).catch(err => {
                                inoltra_errore(res, err.message);
                            });
                        }
                    ).catch(err => {
                        inoltra_errore(res, err.message);
                    });
                });
            } else {
                inoltra_errore(res, 'Nessun ordine trovato per la ricerca corrente');
                return;
            }
        }
    });

});