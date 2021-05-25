/** MAIN **/
Vue.component('route-map', {
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
        initMap();
    },
    template: `
        <section>    
            <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-start">
                <div id="map" class="section"></div>
                <map-style-selector class="selector"></map-style-selector>   
            </div>
        </section>`
});
/** END MAIN **/

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
    created,
    template: `
        <div class="select-none flex flex-row h-10 w-screen bg-dark absolute top-0 left-0 justify-center">
            <div v-show="open" v-for="section in sections" class="cursor-pointer flex flex-col h-full bg-transparent w-20 mx-2 bottom-0 justify-center rounded-b-xl transition-all duration-500 ease-in-out" @click="changeMap(section)">
                <span :class="subSectionClass(section)" class="text-center transition-all duration-500 ease-in-out">{{section.label}}</span>
            </div>
            <div v-show="!open" class="flex flex-row h-full bg-transparent w-screen mx-2 bottom-0 justify-center rounded-b-xl transition-all duration-500 ease-in-out" @click="changeMap(section)">
                <!--span class="flex flex-col justify-center text-white text-center material-icons mr-1">create</span-->
                <span class="cursor-pointer flex flex-col justify-center text-white text-left" @click="open = true">Cambia Stile Mappa</span>
            </div>
        </div>
    `
});
/** END SELECTOR **/