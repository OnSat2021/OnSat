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
    <transition name="slide-fade">
        <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">Paths</div>
    </transition>`
});
/** END MAIN **/