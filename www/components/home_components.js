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
    <transition name="slide-fade">
        <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-start">
            <weather-section class="section" v-show="checkSection('/weather')"></weather-section>
            <bikes-section class="section" v-show="checkSection('/bikes')"></bikes-section>
            <user-section class="section" v-show="checkSection('/user')"></user-section>
            <logout-section class="section" v-show="checkSection('/logout')"></logout-section>
            <home-selector class="selector" v-on:update-section="updateCurrentSection"></home-selector>
        </div>
    </transition>`
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
                },
                {
                    "label": "Logout",
                    "path": "logout"
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
        <div class="select-none flex flex-row h-10 w-screen bg-dark absolute top-0 left-0 justify-center">
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
    <transition name="slide-fade">
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
    Weather
    </div>
    </transition>`
});
Vue.component('bikes-section', {
    template: `
    <transition name="slide-fade">
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
    Bikes
    </div>
    </transition>`
});
Vue.component('user-section', {
    template: `
    <transition name="slide-fade">
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
    User
    </div>
    </transition>`
});
Vue.component('logout-section', {
    template: `
    <transition name="slide-fade">
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
    Logout
    </div>
    </transition>`
});
/** END PAGINE INTERNE **/