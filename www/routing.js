Vue.component('route-home', {
    template: `
    <transition name="slide-fade">
        <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
            <home-selector></home-selector>
            Home
        </div>
    </transition>`
});
Vue.component('route-paths', {
    template: `
    <transition name="slide-fade">
        <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">Paths</div>
    </transition>`
});
Vue.component('route-map', {
    template: `
    <transition name="slide-fade">
        <section>    
            <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
                <div id="map" class="w-full h-full"></div>
                <map-style-selector></map-style-selector>   
            </div>
        </section>
    </transition>`
});
Vue.component('route-store', {
    template: `
    <transition name="slide-fade">
        <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
            <store-selector></store-selector>
            Store
        </div>
    </transition>`
});