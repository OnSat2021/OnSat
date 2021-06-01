/** MAIN **/
Vue.component('route-home', {
    data() {
        return {
            /** ROUTING **/
            currentSection: window.location.pathname,
        };
    },
    methods: {
        /** ROUTING **/
        checkSection(path) {
            return path == this.currentSection;
        },
        updateCurrentSection(path) {
            this.currentSection = "/" + path;
        }
    },
    mounted() {
        this.currentSection = "/";
    },
    template: `
        <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
            <weather-section class="section" v-show="checkSection('/weather')"></weather-section>
            <bikes-section class="section" v-show="checkSection('/bikes')"></bikes-section>
            <user-section class="section" v-show="checkSection('/user')"></user-section>
            <logout-section class="section" v-show="checkSection('/logout')"></logout-section>
            <home-selector class="selector" v-on:update-section="updateCurrentSection"></home-selector>
        </div>`
});
/** END MAIN **/

/** SELECTOR **/
Vue.component('home-selector', {
    data: function () {
        return {
            sections: [{
                    "label": "Meteo",
                    "path": "weather"
                },
                {
                    "label": "Bici",
                    "path": "bikes"
                },
                {
                    "label": "Profilo",
                    "path": "user"
                }
            ],
            selectedSection: null,
            subSectionClass: (section) => {
                let condition = section == this.selectedSection;
                return selector_class(condition);
            }
        }
    },
    methods: {
        changeMap: function (section) {
            this.$emit("update-section", section.path);
            this.selectedSection = section;
        }
    },
    created,
    template: `
        <div class="select-none flex flex-row h-10 w-full bg-dark absolute top-0 left-0 justify-center">
            <div v-for="section in sections" class="cursor-pointer flex flex-col h-full bg-transparent w-20 mx-2 bottom-0 justify-center rounded-b-xl transition-all duration-500 ease-in-out" @click="changeMap(section)">
                <span :class="subSectionClass(section)" class="text-center transition-all duration-500 ease-in-out">{{section.label}}</span>
            </div>
        </div>
    `
});
/** END SELECTOR **/

/** PAGINE INTERNE **/
Vue.component('weather-section', {
    template: `
    <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-center">
    Weather
    </div>`
});

Vue.component('bikes-section', {
    data: () => {
        return {
            bikes: [],
            addNew: false,
            updateBike: false,
            models: [],
            bikeToUpdate: null,
        }
    },
    computed: {
        bikesFound() {
            return this.bikes.length;
        },
        subtitle() {
            if (this.addNew) {
                return "Aggiungi nuova bici";
            } else if (this.updateBike) {
                return "Modifica bici";
            } else {
                if (this.bikesFound > 0)
                    return "Gestisci i tuoi mezzi";
                else
                    return "Nessuna bici trovata";
            }
        }
    },
    methods: {
        submitBikeForm() {
            const fd_id = (this.addNew) ? "add_new_bike" : "update_bike";
            let fd = new FormData(document.getElementById(fd_id));
            var object = {};
            fd.forEach((value, key) => object[key] = value);
            object['user_id'] = window.localStorage.user_id;
            var json = JSON.parse(JSON.stringify(object));

            sendRequest('POST', '/bike', json, obj => {
                if (obj.error_code) {
                    app.alertPresent("Errore", obj.error_desc, 'Ok');
                } else {
                    //app.alertPresent("Success", 'Bici aggiunta con successo.', 'Ok');
                    this.addNew = false;
                    this.updateBike = false;
                }
                this.updateBikeList();
            });
        },
        updateBikeList() {
            sendRequest('GET', '/bike', {
                user_id: window.localStorage.user_id
            }, obj => {
                if (obj.error_code)
                    console.log(obj.error_desc);
                else {
                    this.bikes = obj.result
                    this.drawBikesOnMap();
                }
            });
        },
        getBikeModels() {
            sendRequest('GET', '/model', {}, obj => {
                if (obj.error_code)
                    console.log(obj.error_desc);
                else
                    this.models = obj.result
            });
        },
        toggleUpdateBike(bike) {
            if (this.updateBike) {
                this.updateBike = false;
                this.bikeToUpdate = null;
            } else {
                this.updateBike = true;
                this.bikeToUpdate = bike;
            }
        },
        drawBikesOnMap() {
            this.bikes.forEach(bike => {
                console.log(bike.current_lat, bike.current_lon);
                if (bike_markers.hasOwnProperty(bike.id)) {
                    bike_markers[bike.id].setMap(null);
                }
                let iconBase = './src/imgs/icons/';

                var icon = {
                    url: iconBase + 'bike.png',
                    scaledSize: new google.maps.Size(40, 40), // scaled size
                    origin: new google.maps.Point(0, 0), // origin
                    anchor: new google.maps.Point(0, 0) // anchor
                };

                let marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(bike.current_lat),
                        lng: parseFloat(bike.current_lon),
                    },
                    map,
                    title: bike.name,
                    icon: icon,
                });

                marker.addListener("click", () => {
                    map.setZoom(15);
                    map.setCenter(marker.getPosition());
                    maps_app.popupBike(bike);
                });

                bike_markers[bike.id] = marker;
            });
        }
    },
    mounted() {
        this.updateBikeList();
        this.getBikeModels();
    },
    template: `
    <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start pb-2 section">
        <section-header title="Bici" :subtitle="subtitle"></section-header>

        <template v-if="!addNew && !updateBike">
            <span class="flex flex-col justify-between pb-8">
                <bike-card v-if="bikesFound > 0" v-for="(bike, i) in bikes" :key="bike.id" :idx="i" :bike="bike" @updateBike="toggleUpdateBike"></bike-card>

                <div @click="addNew = true" class="cursor-pointer relative top-0 left-0 bike-card mx-auto bg-light text-white text-center font-bold flex flex-col justify-center rounded-3xl my-12 mb-24">
                    <div class="absolute bottom-0 left-0 w-full h-full flex flex-col text-center justify-center p-6 py-2" >
                        <span class="text-white text-2xl m-0">Aggiungi Nuova</span>
                    </div>
                </div>
            </span>
        </template>

        <template v-else-if="addNew">
            <span class="flex flex-col justify-between h-full">
                <form id="add_new_bike" method="POST">
                    <input-field name="name" label="Nome" placeholder="" value="" type="text"></input-field>
                    <input-field name="imei" label="IMEI del Tracker" placeholder="" value="" type="text"></input-field>
                    <select-field name="model_id" label="Seleziona Modello" :options="models"></select-field>
                </form>
                <span>
                    <flat-button @click="submitBikeForm()" label="aggiungi" class="mb-1"></flat-button>
                    <div @click="addNew = false" class="cursor-pointer mt-0 mb-4 p-3 text-white text-md">annulla</div>
                </span>
            </span>
        </template>

        <template v-else-if="updateBike">
            <span class="flex flex-col justify-between h-full">
                <form id="update_bike" method="POST">
                    <input-field class="hidden" name="bike_id" label="Id" placeholder="" :value="bikeToUpdate.id" type="text"></input-field>
                    <input-field name="name" label="Nome" placeholder="" :value="bikeToUpdate.name" type="text"></input-field>
                    <input-field name="imei" label="IMEI del Tracker" placeholder="" :value="bikeToUpdate.imei_tracker" type="text"></input-field>
                    <select-field name="model_id" label="Seleziona Modello" :options="models" :selectedModel="bikeToUpdate.model.id"></select-field>
                </form>
                <span>
                    <flat-button @click="submitBikeForm()" label="modifica" class="mb-1"></flat-button>
                    <div @click="updateBike = false" class="cursor-pointer mt-0 mb-4 p-3 text-white text-md">annulla</div>
                </span>
            </span>
        </template>

    </div>`
});

Vue.component('select-field', {
    props: ['label', 'name', 'placeholder', 'value', 'type', 'options', 'selectedModel'],
    methods: {
        checkSelected(option) {
            return option.id == this.selectedModel;
        }
    },
    template: `
        <div class="relative w-full text-left text-white flex flex-col justify-center px-8 my-2">
            <h4 class="text-sm font-bold p-4 pb-2">{{label}}</h4>
            <select :placeholder="placeholder" :name="name" class="custom-select placeholder-gray-400 bg-light px-4 py-4 border-none focus:outline-none rounded-2xl text-lg font-semibold w-full">
                <option v-for="option in options" :selected="checkSelected(option)" :value="option.id" class="bg-light p-5 border-none focus:outline-none rounded-2xl text-lg font-semibold">{{option.name}}</option>
            </select>
        </div>
    `
});

Vue.component('input-field', {
    props: ['label', 'name', 'placeholder', 'value', 'type'],
    template: `
        <div class="relative w-full text-left text-white flex flex-col justify-center px-8 my-2">
            <!--h4 class="text-sm font-bold">{{label}}</h4-->
            <input :placeholder="label" :name="name" :value="value" :type="type" class="placeholder-gray-400 bg-light my-1 px-4 py-3 border-none focus:outline-none rounded-2xl text-lg font-semibold">
        </div>
    `
});

Vue.component('bike-card', {
    props: ['bike', 'idx'],
    data() {
        return {
            options: false
        }
    },
    methods: {
        background(url) {
            return "background: var();" +
                "background-image: url('" + url + "');" +
                "background-image: url('" + url + "'), linear-gradient(208.42deg, #00C8C8 45.09%, #2A96F0 83.49%);";
        },
        classObj: (idx) => {
            let resto = idx % 3;
            console.log(resto);
            return {
                'bg-red-500': resto == 0,
                'bg-yellow-500': resto == 1,
                'bg-blue-500': resto == 2,
            }
        },
        removeBike() {
            let self = this;
            let json = {
                ok_function: () => {
                    console.log('Elimino bici: ' + self.bike.id);
                    sendRequest('DELETE', '/bike', {
                        bike_id: self.bike.id
                    }, json => {
                        if (json.error_code)
                            app.alertPresent('Errore eliminazione', json.error_desc, 'ok');
                        else
                            console.log('Bici cancellata con successo');
                        //app.alertPresent('Successo', 'Bici eliminata con successo', 'ok');
                        self.$parent.updateBikeList();
                    });
                },
                ko_label: 'annulla'
            };
            app.alertPresent('Conferma eliminazione', 'Sei sicuro di voler eliminare <b>' + this.bike.name + '</b>?', 'elimina', json);
        },
        updateBike() {
            //console.log('Emetto evento');
            this.$emit('updateBike', this.bike);
        }
    },
    mounted() {},
    computed: {},
    template: `
    <span>
            <div  class="relative top-0 left-0 bike-card mx-auto bg-transparent bg-center bg-no-repeat bg-cover text-white  text-center font-bold flex flex-col justify-center rounded-3xl my-0 -mt-2">
                <span class="rounded-3xl mt-12 shadow-2xl" :class="classObj(idx)">
                    <img :src="bike.model.picture" class="-mt-12 object-cover object-right h-64 rounded-3xl">
                    <div class="absolute top-0 left-0 w-full h-full bg-bike-shade rounded-3xl">
                        <span class="absolute top-0 right-0 mt-8 -mr-2 flex flex-col justify-start z-40">
                            <span v-if="!options" class="cursor-pointer mb-1 text-red-500 bg-white rounded-3xl p-2 material-icons" @click="options = true">more_vert</span>
                            <span v-if="options" class="cursor-pointer mb-1 text-red-500 bg-white rounded-3xl p-2 material-icons" @click="options = false">expand_less</span>
                            <span v-if="options" class="cursor-pointer mb-1 text-white bg-light rounded-3xl p-2 material-icons" @click="removeBike()">delete</span>
                            <span v-if="options" class="cursor-pointer mb-1 text-white bg-light rounded-3xl p-2 material-icons" @click="updateBike()">edit</span>
                            <span v-if="options" class="cursor-pointer mb-1 text-white bg-light rounded-3xl p-2 material-icons" @click="">map</span>
                        </span>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-1/2 flex flex-col text-left justify-end p-6 py-2" >
                        <span class="text-white text-2xl m-0">{{bike.name}}</span>
                        <span class="text-white text-md font-normal m-0 mb-2"><b>{{bike.model.name}}</b></span>
                    </div>
                </span>
            </div>
    </span>
    `
});

Vue.component('user-section', {
    data: () => {
        return {
            user: {}
        }
    },
    computed: {
        complete_name() {
            return this.user.name + " " + this.user.surname;
        }
    },
    mounted() {
        sendRequest('GET', '/user', {
            user_id: window.localStorage.user_id
        }, obj => {
            if (obj.error_code)
                app.alertPresent("Errore", obj.error_desc, 'Ok');
            else
                this.user = obj.result
        });
    },
    template: `
    <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-between pb-2">
        <span>
            <section-header :title="complete_name" :subtitle="user.email"></section-header>
            <info-data v-show="user.address" label="Indirizzo" :data="user.address"></info-data>
            <info-data v-show="user.cellphone" label="Cellulare" :data="user.cellphone"></info-data>
            <info-data label="User Id" :data="user.id"></info-data>
            <info-data label="Google Id" :data="user.google_id"></info-data>
        </span>
        <flat-button onclick="logout()" label="Esegui Logout" mode="light"></flat-button>
    </div>`
});
Vue.component('logout-section', {
    template: `
    <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-end">
        <flat-button onclick="logout()" label="Esegui Logout" mode="light"></flat-button>
    </div>`
});
/** END PAGINE INTERNE **/


Vue.component('info-data', {
    props: ['label', 'data'],
    template: `
        <div class="relative w-full text-left text-white flex flex-col justify-center px-8 my-2">
            <h4 class="text-sm font-bold">{{label}}</h4>
            <h3 class="text-md font-normal">{{data}}</h3>
        </div>
    `
});

var bike_markers = {};