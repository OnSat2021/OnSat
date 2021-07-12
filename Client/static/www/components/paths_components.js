/** MAIN **/
Vue.component('route-paths', {
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
        },
    },
    mounted() {
        this.currentSection = "/";
    },
    template: `
    <section>    
    <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
        <route-section class="section no-selector"></route-section>   
    </div>
</section>`
});
/** END MAIN **/

Vue.component('route-section', {
    data() {
        return {
            flip: false,
            routes: []
        };
    },
    methods: {
        updateRoutes() {
            var self = this;
            sendRequest('GET', '/route', {}, json => {
                if (json.error_code)
                    app.alertPresent('Errore', json.error_desc, 'ok');
                self.routes = json.result;
            });
        }
    },
    mounted() {
        this.updateRoutes();
        routes = this;
    },
    template: `
        <div class="relative top-0 left-0 h-full w-full bg-light text-white text-center font-bold flex flex-col justify-start px-2 py-5 overflow-y-scroll">
                <route-card v-for="route in routes" :key="route.id" :route="route"></route-card>
        </div>`
});
var routes;

Vue.component('route-card', {
    props: ['route'],
    data() {
        return {
            flipped: false
        }
    },
    methods: {
        background(url) {
            return "background-image: url('" + url + "');";
        },
        classObj: (color) => {
            return {
                'bg-black': color == 'black',
                'bg-red-600': color == 'red',
                'bg-yellow-600': color == 'yellow',
                'bg-green-600': color == 'green',
            }
        }
    },
    mounted() {},
    computed: {},
    template: `
    <span>
        <transition name="flip"> 
            <div v-show="!flipped" @click="flipped = !flipped" class="relative top-0 left-0 route-card mx-auto bg-transparent bg-center bg-no-repeat bg-cover text-white shadow-2xl text-center font-bold flex flex-col justify-center rounded-3xl mb-4" :style="background(route.picture)">
                    <span>
                        <div class="absolute top-0 left-0 w-full h-full bg-route-shade rounded-3xl"></div>
                        <div class="absolute bottom-0 left-0 w-full h-1/2 flex flex-col text-left justify-end p-6 py-10" >
                            <span class="text-white text-xl font-normal m-0"><b>{{route.duration}}</b> / <b>{{route.length}}</b></span>
                            <span class="text-white text-4xl m-0">{{route.name}}</span>
                            <span class="text-white text-md font-normal m-0 mb-2">da <b>{{route.start_poi.name}}</b> a <b>{{route.end_poi.name}}</b></span>
                            <!--span class="text-white text-sm font-normal ellipsis mb-2" v-html="route.description"></span>
                            <span class="text-white text-sm ellipsis pb-2 w-full text-center">continua a leggere</span-->
                        </div>
                        <div class="absolute h-12 left-4 top-4 rounded-full shadow-md p-0 bg-white text-dark flex flex-row justify-evenly">
                            <span class="h-full mr-2 text-sm flex flex-col justify-center">
                                <span class="h-12 w-12 material-icons text-white rounded-full p-3 font-normal" :class="classObj(route.ideal_for.icon_color)">pedal_bike</span>
                            </span>
                            <span class="h-full text-sm flex flex-col justify-center text-left mr-4">
                                <span>Difficoltà {{route.ideal_for.level}}</span>
                            </span>
                        </div>
                    </span>
            </div>
        </transition>
        <transition name="flip"> 
            <div v-show="flipped" @click="flipped = !flipped" class="relative top-0 left-0 route-card mx-auto bg-white bg-center bg-no-repeat bg-cover text-dark shadow-2xl text-center font-bold flex flex-col justify-center rounded-3xl mb-4">
                    <span>
                        <div class="absolute bottom-0 left-0 w-full h-full flex flex-col text-left justify-start p-6 py-10">
                            <span class="text-dark text-2xl m-0">{{route.name}}</span>
                            <span class="text-dark text-md font-normal m-0 mb-2">da <b>{{route.start_poi.name}}</b> a <b>{{route.end_poi.name}}</b></span>
                            <span class="text-dark text-xs font-normal ellipsis mb-2" v-html="route.description"></span>
                            <br>
                            <span class="text-dark text-md ellipsis pb-2 w-full text-left">Livello di difficoltà {{route.ideal_for.level}}</span>
                            <span class="text-dark text-xs font-normal ellipsis mb-2">{{route.ideal_for.description}}</span>
                        </div>
                        <div class="absolute bottom-2 text-center w-full">
                            <flat-button label="Seleziona" mode="dark" class="mx-auto hidden"></flat-button>
                        </div>
                    </span>
            </div>
        </transition>
    </span>
    `
});