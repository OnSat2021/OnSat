const Bike = {
    "id": "bik_00000000",
    "imei": "00000000",
    "name": "Bici di Filippo",
    "model": Modello,
    "tracker": Tracker,
};

const Modello = {
    "id": "mod_00000000",
    "name": "All Road Plus",
    "picture": "/all_road_plus.png"
};

const Tracker = {
    "id": "trk_00000000",
    "imei": "00000000000000000000",
    "bike_id": "bik_00000000",
};

const User = {
    "id": "usr_00000000",
    "name": "Filippo",
    "surname": "Carboni",
    "address": {
        "line1": "",
        "line2": "",
        "city": "",
        "country": "",
        "postal_code": "",
        "state": ""
    }
}

const Itinerary = {
    "id": "jrn_00000000",
    "name": "Alla scoperta del Colosseo",
    /*"start_label":"Piazza del Popolo",
    "start_lat":"12.1234567",
    "start_lon":"42.1234567",
    "end_label":"Colosseo",
    "end_lat":"12.1234567",
    "end_lon":"41.1234567",*/
    "start_place": Place,
    "end_place": Place,
    "duration_extimate": "123"
}

const Place = {
    "id": "plc_00000000",
    "label": "Colosseo",
    "lat": 12.56367765,
    "lon": 12.4356
}

const Path = {

}