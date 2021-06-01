/** MAIN **/
Vue.component('route-map', {
    props: ['bikes'],
    data() {
        return {
            /** ROUTING **/
            currentSection: window.location.pathname,
            bike: null,
            showPopupBike: false,
        };
    },
    methods: {
        /** ROUTING **/
        checkSection(path) {
            return path == this.currentSection;
        },
        updateCurrentSection(path) {
            this.currentSection = "/" + path;
        },
        popupBike(bike) {
            this.showPopupBike = true;
            this.bike = bike;
        }
    },
    mounted() {
        this.currentSection = "/";
        initMap();
        maps_app = this;
    },
    template: `
        <section>    
            <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
                <div id="map" class="section"></div>
                <map-style-selector class="selector"></map-style-selector>
                <popup-bike v-if="showPopupBike" :bike="bike"></popup-bike>  
            </div>
        </section>`
});
/** END MAIN **/


Vue.component('popup-bike', {
    props: ['bike'],
    data: function () {
        return {}
    },
    methods: {

    },
    template: `
        <div class="select-none flex flex-row w-full bg-light absolute h-1/4 w-full bottom-0 p-4 left-0 text-left">
            
            <div class="flex flex-col h-full justify-center text-center w-1/2 pb-24">
                <span>
                    <span class="text-4xl material-icons">bolt</span>
                    <span class="text-4xl text-green-400">{{bike.battery_level}} %</span>
                </span>
                <span class="text-md">di carica residua</span>
            </div>

            <div class="flex flex-col h-full justify-center w-1/2 pb-24">
                <span class="text-xl" v-html="bike.name"></span>
                <span class="text-md" v-html="bike.model.name"></span>
                <span class="text-sm text-blue-400">{{bike.current_lat}}, {{bike.current_lon}}</span>
            </div>
            
        </div>
    `
});


/** SELECTOR **/
Vue.component('map-style-selector', {
    data: function () {
        return {
            sections: [{
                    "label": "Classic",
                    "value": "default",
                    "path": ""
                },
                {
                    "label": "Dark",
                    "value": "night",
                    "path": ""
                },
                {
                    "label": "Retro",
                    "value": "retro",
                    "path": ""
                },
                {
                    "label": "Silver",
                    "value": "silver",
                    "path": ""
                }
            ],
            selectedSection: null,
            subSectionClass: (section) => {
                let condition = section == this.selectedSection;
                return selector_class(condition);
            },
            open: true,
        }
    },
    methods: {
        changeMap: function (section) {
            this.selectedSection = section;
            app.print("Cambio mappa: " + section.value);
            map.setOptions({
                styles: styles[section.value]
            });
        }
    },
    template: `
        <div class="select-none flex flex-row h-10 w-full bg-dark absolute top-0 left-0 justify-center">
            <div v-show="open" v-for="section in sections" class="cursor-pointer flex flex-col h-full bg-transparent w-20 mx-2 bottom-0 justify-center rounded-b-xl transition-all duration-500 ease-in-out" @click="changeMap(section)">
                <span :class="subSectionClass(section)" class="text-center transition-all duration-500 ease-in-out">{{section.label}}</span>
            </div>
            <div v-show="!open" class="flex flex-row h-full bg-transparent w-full mx-2 bottom-0 justify-center rounded-b-xl transition-all duration-500 ease-in-out" @click="changeMap(section)">
                <!--span class="flex flex-col justify-center text-white text-center material-icons mr-1">create</span-->
                <span class="cursor-pointer flex flex-col justify-center text-white text-left" @click="open = true">Cambia Stile Mappa</span>
            </div>
        </div>
    `
});
/** END SELECTOR **/

var maps_app;