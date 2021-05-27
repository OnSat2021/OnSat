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
        }
    },
    mounted() {
        this.currentSection = "/";
    },
    template: `
    <section>    
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-start">
        <route-section class="section no-selector"></route-section>   
    </div>
</section>`
});
/** END MAIN **/

Vue.component('route-section', {
    data() {
        return {
            flip: false,
            routes: [{
                    id: '1',
                    name: 'Gita a Parioli',
                    description: 'La pista, scaturita dalla necessità di un collegamento tra le direttrici Tevere e Aniene, offre un percorso di elevata qualità paesaggistica e ambientale. Il tracciato che si snoda all\'interno del territorio del Municipio II interessa due aree di verde pubblico di notevole interesse quali Villa Glori e Monte Antenne, dove sono presenti attrezzature sportive e per il tempo libero, che qualificano ulteriormente il contesto. Percorrendo questa pista è possibile raggiungere l\'Auditorium in bici.',
                    start_poi: {
                        id: 'poi_M7DcsAyZYfXw2Kn',
                        name: 'Ponte Milvio',
                        lat: 41.936358,
                        lon: 12.466608,
                        description: 'Ponte Milvio (o ponte Molle o ponte Mollo) è un ponte di Roma sul fiume Tevere in asse con il primo tratto urbano di via Flaminia; esso collega piazzale Cardinal Consalvi, diviso tra il quartiere Flaminio e il quartiere Parioli, a piazzale di Ponte Milvio, diviso tra il quartiere Della Vittoria e il quartiere Tor di Quinto.',
                        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ponte_Milvio_HD.jpg/1200px-Ponte_Milvio_HD.jpg'
                    },
                    end_poi: {
                        id: 'poi_f0N6jaO4UV1p01u',
                        name: 'Villa Ada',
                        lat: 41.933203,
                        lon: 12.499505,
                        description: 'Villa Ada è il quarto più grande parco pubblico di Roma dopo il Parco regionale dell\'Appia antica, il Parco regionale del Pineto e Villa Doria Pamphilj. Ospita numerosi edifici neoclassici, tra i quali la villa reale (attualmente in uso alle Legazioni diplomatiche egiziane in Italia). È collocato nella zona settentrionale della città, a nord-ovest della via Salaria, nel quartiere Parioli.',
                        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Villa_Ada_%28Roma%29.JPG/1200px-Villa_Ada_%28Roma%29.JPG'
                    },
                    ideal_for: {
                        level: 2,
                        description: 'Per ciclisti della domenica, attraversamenti stradali e tratti non ciclabili sporadici.',
                        icon_color: 'red'
                    },
                    lenght: '3 km',
                    duration: '1 h',
                    picture: 'http://www.portofrome.it/wp-content/uploads/2015/01/15-84577.jpg'
                },
                {
                    id: '2',
                    name: 'Gita a Parioli',
                    description: 'La pista, scaturita dalla necessità di un collegamento tra le direttrici Tevere e Aniene, offre un percorso di elevata qualità paesaggistica e ambientale. Il tracciato che si snoda all\'interno del territorio del Municipio II interessa due aree di verde pubblico di notevole interesse quali Villa Glori e Monte Antenne, dove sono presenti attrezzature sportive e per il tempo libero, che qualificano ulteriormente il contesto. Percorrendo questa pista è possibile raggiungere l\'Auditorium in bici.',
                    start_poi: {
                        id: 'poi_M7DcsAyZYfXw2Kn',
                        name: 'Ponte Milvio',
                        lat: 41.936358,
                        lon: 12.466608,
                        description: 'Ponte Milvio (o ponte Molle o ponte Mollo) è un ponte di Roma sul fiume Tevere in asse con il primo tratto urbano di via Flaminia; esso collega piazzale Cardinal Consalvi, diviso tra il quartiere Flaminio e il quartiere Parioli, a piazzale di Ponte Milvio, diviso tra il quartiere Della Vittoria e il quartiere Tor di Quinto.',
                        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ponte_Milvio_HD.jpg/1200px-Ponte_Milvio_HD.jpg'
                    },
                    end_poi: {
                        id: 'poi_f0N6jaO4UV1p01u',
                        name: 'Villa Ada',
                        lat: 41.933203,
                        lon: 12.499505,
                        description: 'Villa Ada è il quarto più grande parco pubblico di Roma dopo il Parco regionale dell\'Appia antica, il Parco regionale del Pineto e Villa Doria Pamphilj. Ospita numerosi edifici neoclassici, tra i quali la villa reale (attualmente in uso alle Legazioni diplomatiche egiziane in Italia). È collocato nella zona settentrionale della città, a nord-ovest della via Salaria, nel quartiere Parioli.',
                        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Villa_Ada_%28Roma%29.JPG/1200px-Villa_Ada_%28Roma%29.JPG'
                    },
                    ideal_for: {
                        level: 2,
                        description: 'Per ciclisti della domenica, attraversamenti stradali e tratti non ciclabili sporadici.',
                        icon_color: 'green'
                    },
                    lenght: '3 km',
                    duration: '1 h',
                    picture: 'http://www.portofrome.it/wp-content/uploads/2015/01/15-84577.jpg'
                },
                {
                    id: '3',
                    name: 'All\'ombra del Colosseo',
                    description: 'Il Colosseo, originariamente conosciuto come Amphitheatrum Flavium (in italiano: Anfiteatro Flavio) o semplicemente come Amphitheatrum, situato nel centro della città di Roma, è il più grande anfiteatro del mondo. In grado di contenere un numero di spettatori stimato tra 50 000 e 87 000 unità, è il più importante anfiteatro romano, nonché il più imponente monumento dell\'antica Roma che sia giunto fino a noi.',
                    start_poi: {
                        id: 'poi_M7DcsAyZYfXw2Kn',
                        name: 'Ponte Milvio',
                        lat: 41.936358,
                        lon: 12.466608,
                        description: 'Ponte Milvio (o ponte Molle o ponte Mollo) è un ponte di Roma sul fiume Tevere in asse con il primo tratto urbano di via Flaminia; esso collega piazzale Cardinal Consalvi, diviso tra il quartiere Flaminio e il quartiere Parioli, a piazzale di Ponte Milvio, diviso tra il quartiere Della Vittoria e il quartiere Tor di Quinto.',
                        picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Ponte_Milvio_HD.jpg/1200px-Ponte_Milvio_HD.jpg'
                    },
                    end_poi: {
                        id: 'poi_IXXWSnq2gcADgvk',
                        name: 'Colosseo',
                        lat: 41.890957,
                        lon: 12.492276,
                        description: 'Il Colosseo, originariamente conosciuto come Amphitheatrum Flavium, situato nel centro della città di Roma, è il più grande anfiteatro del mondo. In grado di contenere un numero di spettatori stimato tra 50 000 e 87 000 unità, è il più importante anfiteatro romano, nonché il più imponente monumento dell\'antica Roma che sia giunto fino a noi.',
                        picture: 'https://d9k3q4j9.stackpathcdn.com/wp-content/uploads/2016/10/Colosseo-laptop_1040_529.jpeg'
                    },
                    ideal_for: {
                        level: 2,
                        description: 'Per ciclisti della domenica, attraversamenti stradali e tratti non ciclabili sporadici.',
                        icon_color: 'yellow'
                    },
                    lenght: '3 km',
                    duration: '1 h',
                    picture: 'https://wallpaperaccess.com/full/1127857.jpg'
                }
            ]
        };
    },
    methods: {},
    mounted() {
        routes = this;
    },
    template: `
        <div class="relative top-0 left-0 h-full w-screen bg-light text-white text-center font-bold flex flex-col justify-start px-2 py-5 overflow-y-scroll">
               
                <route-card v-for="route in routes" :key="route.id" :route="route"></route-card>
            
            
        </div>`
});
var routes;


/*

<!--transition v-for="route in routes" name="flip" :key="route.id">    
                <route-card-white v-show="flip" :route="route"></route-card-white>
            </transition-->

*/


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
                            <span class="text-white text-xl font-normal m-0"><b>{{route.duration}}</b> / <b>{{route.lenght}}</b></span>
                            <span class="text-white text-4xl m-0">{{route.name}}</span>
                            <span class="text-white text-md font-normal m-0 mb-2">da <b>{{route.start_poi.name}}</b> a <b>{{route.end_poi.name}}</b></span>
                            <!--span class="text-white text-sm font-normal ellipsis mb-2" v-html="route.description"></span>
                            <span class="text-white text-sm ellipsis pb-2 w-full text-center">continua a leggere</span-->
                        </div>
                        <div class="absolute h-12 left-4 top-4 rounded-full shadow-md p-0 bg-white text-dark flex flex-row justify-evenly">
                            <span class="h-full mr-2 text-sm flex flex-col justify-center">
                                <span class="h-12 w-12 material-icons bg-white text-white rounded-full p-3 font-normal" :class="classObj(route.ideal_for.icon_color)">pedal_bike</span>
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
                            <flat-button label="Seleziona" mode="dark" class="mx-auto"></flat-button>
                        </div>
                    </span>
            </div>
        </transition>
    </span>
    `
});

Vue.component('route-card-white', {
    props: ['route'],
    data() {
        return {
            flipped: false
        }
    },
    methods: {
        background(url) {
            if (!this.flipped)
                return "background-image: url('" + url + "');";
            else
                return "background-image: none; background: white;";
        },
    },
    mounted() {

    },
    template: `
    <div @click="flipped = !flipped" class="relative top-0 left-0 route-card mx-auto bg-transparent bg-center bg-no-repeat bg-cover text-white shadow-2xl text-center font-bold flex flex-col justify-center rounded-3xl mb-4" :style="background(route.picture)">
            <span>
                <div class="absolute top-0 left-0 w-full h-full bg-route-shade rounded-3xl"></div>
                <div class="absolute bottom-0 left-0 w-full h-1/2 flex flex-col text-left justify-end p-6 py-10" >
                    <span class="text-white text-xl font-normal m-0"><b>{{route.duration}}</b> / <b>{{route.lenght}}</b></span>
                    <span class="text-white text-4xl m-0">{{route.name}}</span>
                    <span class="text-white text-md font-normal m-0 mb-2">da <b>{{route.start_poi.name}}</b> a <b>{{route.end_poi.name}}</b></span>
                    <!--span class="text-white text-sm font-normal ellipsis mb-2" v-html="route.description"></span>
                    <span class="text-white text-sm ellipsis pb-2 w-full text-center">continua a leggere</span-->
                </div>
                <div class="absolute right-4 top-4 rounded-3xl p-4 bg-light">
                    <span class="text-white text-sm">Difficoltà</span>
                </div>
            </span>
        </transition>
    </div>
    `
});