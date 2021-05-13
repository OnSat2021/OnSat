let mounted = function () {
    this.selectedSection = this.sections[0];
};

var navigationBar = Vue.component('navigation-bar', {
    data: function () {
        return {
            sections: [{
                    "label": "Home",
                    "icon": "home",
                    "path": "/"
                },
                {
                    "label": "Itinerari",
                    "icon": "explore",
                    "path": "/paths"
                },
                {
                    "label": "Mappa",
                    "icon": "map",
                    "path": "/map"
                },
                {
                    "label": "Store",
                    "icon": "local_grocery_store",
                    "path": "/store"
                }
            ],
            selectedSection: null,
            sectionClass: (section) => {
                let condition = section == this.selectedSection;
                return {
                    'bg-white': condition,
                    '-mt-2': condition,
                    'shadow-2xl': condition
                }
            },
            subSectionClass: (section) => {
                let condition = section == this.selectedSection;
                return {
                    'text-dark': condition,
                    'text-white': !condition,
                }
            }
        }
    },
    methods: {
        goTo: function (section) {
            this.selectedSection = section;
            app.print("Navigo verso: " + section.path);
            app.currentRoute = section.path;
        }
    },
    mounted,
    template: `
        <div class="select-none flex flex-row h-16 w-screen bg-dark absolute bottom-0 left-0 justify-center rounded-t-xl">
            <div v-for="section in sections" :class="sectionClass(section)" class="cursor-pointer flex flex-col h-full bg-transparent w-20 mx-2 mt-0 justify-center rounded-xl transition-all duration-500 ease-in-out" @click="goTo(section)">
                <span :class="subSectionClass(section)" class="text-center material-icons transition-all duration-500 ease-in-out">{{section.icon}}</span>
                <span :class="subSectionClass(section)" class="text-center transition-all duration-500 ease-in-out">{{section.label}}</span>
            </div>
        </div>
    `
});

function selector_class(condition) {
    return {
        'text-white': condition,
        'text-gray-500': !condition,
        'text-lg': condition
    }
};

/** MAP **/
Vue.component('map-style-selector', {
    data: function () {
        return {
            sections: [{
                    "label": "Classic",
                    "value": "default"
                },
                {
                    "label": "Dark",
                    "value": "night"
                },
                {
                    "label": "Retro",
                    "value": "retro"
                },
                {
                    "label": "Silver",
                    "value": "silver"
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
    mounted,
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
/** END MAP **/
/** HOME **/
Vue.component('home-selector', {
    data: function () {
        return {
            sections: [{
                    "label": "Meteo",
                    "value": "default"
                },
                {
                    "label": "Bici",
                    "value": "night"
                },
                {
                    "label": "Profilo",
                    "value": "retro"
                },
                {
                    "label": "Logout",
                    "value": "silver"
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
            this.selectedSection = section;
        }
    },
    mounted,
    template: `
        <div class="select-none flex flex-row h-10 w-screen bg-dark absolute top-0 left-0 justify-center">
            <div v-for="section in sections" class="cursor-pointer flex flex-col h-full bg-transparent w-20 mx-2 bottom-0 justify-center rounded-b-xl transition-all duration-500 ease-in-out" @click="changeMap(section)">
                <span :class="subSectionClass(section)" class="text-center transition-all duration-500 ease-in-out">{{section.label}}</span>
            </div>
        </div>
    `
});
/** END HOME **/


/** STORE **/
Vue.component('store-selector', {
    data: function () {
        return {
            sections: [{
                    "label": "Catalogo",
                    "value": "default"
                }, {
                    "label": "Ordini",
                    "value": "default"
                },
                {
                    "label": "Carrello",
                    "value": "night"
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
            this.selectedSection = section;
        }
    },
    mounted,
    template: `
        <div class="select-none flex flex-row h-10 w-screen bg-dark absolute top-0 left-0 justify-center">
            <div v-for="section in sections" class="cursor-pointer flex flex-col h-full bg-transparent w-20 mx-2 bottom-0 justify-center rounded-b-xl transition-all duration-500 ease-in-out" @click="changeMap(section)">
                <span :class="subSectionClass(section)" class="text-center transition-all duration-500 ease-in-out">{{section.label}}</span>
            </div>
        </div>
    `
});
/** END STORE **/


Vue.component('loader', {
    props: ['loader'],
    template: `<div class="absolute top-0 left-0 text-center flex flex-col justify-center h-screen w-screen z-50">
        <img v-bind:src="loader.picture" class="h-12 w-12 mt-0 mx-auto mb-4">
        <h3>{{loader.message}}</h3>
    </div>`
});

Vue.component('alert', {
    props: ['alert'],
    template: `<div class="alert">
        <h2>{{alert.message}}</h2>
        <h3>{{alert.body}}</h3>
        <br>
        <slot></slot>
    </div>`
});

Vue.component('flat-button', {
    props: ['label', 'dark'],
    template: `<div class="flat-button" :class="{'dark':'dark'}">
        <h3>{{label}}</h3>
    </div>`
});

Vue.component('backdrop', {
    template: `<div class="h-screen w-screen bg-black absolute top-0 left-0 z-30 opacity-60"></div>`
});

/*
app = app.mount('#app');
*/