const emitLog = require('../rabbit/emit');
var request = require('request');

module.exports = {
    createEvent,
    listCalendars
}

const api_url = 'https://www.googleapis.com/calendar/v3';

function serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function createEvent(a_t, calendar_id, description) {

    var event = {
        "summary": description.summary,
        "location": description.address,
        "description": description.description,
        "start": {
            "dateTime": description.start,
            "timeZone": "Europe/Rome"
        },
        "end": {
            "dateTime": description.end,
            "timeZone": "Europe/Rome"
        },
        /*"recurrence": [
            "RRULE:FREQ=DAILY;COUNT=2"
        ],*/
        "attendees": [{
            "email": description.email
        }],
        "reminders": {
            "useDefault": false,
            "overrides": [{
                    "method": "email",
                    "minutes": 1440
                },
                {
                    "method": "popup",
                    "minutes": 10
                }
            ]
        }
    };
    console.log(event);

    var options = {
        url: api_url + '/calendars/' + calendar_id + '/events?sendUpdates=all',
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + a_t
        },
        body: JSON.stringify(event)
    };
    request.post(options, function (error, response, body) {

        console.log(response);
        console.log(error);
        console.log(body);


        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            emitLog.sendLog('warning', obj);
            console.log("******************************RISPOSTA CREAZIONE******************************")
            console.log(obj);
            console.log("******************************FINE RISPOSTA CREAZIONE******************************")
        } else {
            emitLog.sendLog('error', body);
            console.log(body);
        }
    });
    var options = {
        url: api_url + '/users/me/calendarList/',
        headers: {
            'Authorization': 'Bearer ' + a_t
        }
    }

}

function listCalendars(a_t) {

    var options = {
        url: api_url + '/users/me/calendarList/',
        headers: {
            'Authorization': 'Bearer ' + a_t
        }
    };

    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                emitLog.sendLog(body);
                var obj = JSON.parse(body);
                if (obj.hasOwnProperty('items') && obj.items.length > 0) {
                    const calendar_id = obj.items[0].id;
                    resolve({
                        error_code: 0,
                        calendar_id: calendar_id
                    });
                } else {
                    emitLog.sendLog('error', 'Nessun Calendario trovato');
                    reject({
                        error_code: 1,
                        error_desc: 'Nessun calendario trovato.',
                        body: body
                    });
                }
            } else {
                emitLog.sendLog('error', body);
                reject({
                    error_code: 1,
                    error_desc: 'Nessun calendario trovato.'
                });
            }
        });
    })



}