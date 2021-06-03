let created = async function() {
    await setTimeout(null, 0);
    this.selectedSection = this.sections[0];
    this.$emit("update-section", this.selectedSection.path);
};


var navigationBar;
Vue.component('navigation-bar', {
    data: function() {
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
        goTo(section) {
            this.selectedSection = section;
            app.print("Navigo verso: " + section.path);
            app.currentRoute = section.path;
        }
    },
    mounted() {
        navigationBar = this;
    },
    template: `
        <div class="navigation-bar select-none flex flex-row h-16 wh-custom-screen bg-dark absolute bottom-0 left-0 justify-center rounded-t-xl">
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

Vue.component('loader', {
    props: ['loader'],
    template: `<div class="absolute top-0 left-0 text-center flex flex-col justify-center h-full w-full z-50 cursor-wait">
        <img v-bind:src="loader.picture" class="h-12 w-12 mt-0 mx-auto mb-4">
        <h3>{{loader.message}}</h3>
    </div>`
});

Vue.component('alert', {
    props: ['alert'],
    methods: {
        on_ok() {
            if (this.alert.on_ok) this.alert.on_ok();
            app.alertDismiss();
        },
        on_ko() {
            app.alertDismiss();
        },
    },
    template: `<div class="alert absolute left-0 bottom-0 h-auto bg-light text-white">
        <h2 class="p-2 mt-4 mb-1 font-bold" v-html="alert.message"></h2>
        <h3 class="p-2 mt-1" v-html="alert.body"></h3>
        <flat-button class="mb-2" v-if="alert.button" :label="alert.button" mode="light" @click="on_ok()">
        </flat-button>
        <flat-button class="mt-2" v-if="alert.ko_label" :label="alert.ko_label" mode="dark" @click="on_ko()">
        </flat-button>
    </div>`
});

Vue.component('flat-button', {
    props: ['label', 'mode'],
    methods: {
        emitClick() {
            this.$emit("click", "");
        }
    },
    template: `<div class="flat-button cursor-pointer" :class="{'dark': (mode == 'dark')}" @click="emitClick()">
        <h3>{{label}}</h3>
    </div>`
});

Vue.component('backdrop', {
    template: `<div class="h-full w-full bg-black absolute top-0 left-0 z-30 opacity-60"></div>`
});

/*
app = app.mount('#app');
*/




Vue.component('section-header', {
    props: ['title', 'subtitle'],
    template: `<div class="w-full left-0 top-0 relative text-white text-left p-8">
        <h1 class="text-5xl font-bold">{{title}}</h1>
        <h2 class="text-xl mt-2 font-normal" v-if="subtitle" v-html="subtitle"></h2>
    </div>`
});