const emitLog = require('../rabbit/emit');
var request = require('request');

module.exports = {
    login,
    loginUrl,
    token,
    getToken,
    a_t,

}

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








