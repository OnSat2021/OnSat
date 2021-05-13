/** MAIN **/

Vue.component('route-store', {
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
        <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
            <catalog-section v-show="checkSection('/catalog')"></catalog-section>
            <orders-section v-show="checkSection('/orders')"></orders-section>
            <cart-section v-show="checkSection('/cart')"></cart-section>
            <store-selector v-on:update-section="updateCurrentSection"></store-selector>
        </div>
    </transition>`
});
/** END MAIN **/

/** SELECTOR **/
Vue.component('store-selector', {
    data: function () {
        return {
            sections: [{
                    "label": "Catalogo",
                    "value": "default",
                    "path": "catalog"
                }, {
                    "label": "Ordini",
                    "value": "default",
                    "path": "orders"
                },
                {
                    "label": "Carrello",
                    "value": "night",
                    "path": "cart"
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
Vue.component('catalog-section', {
    template: `
    <transition name="slide-fade">
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
    Catalog
    </div>
    </transition>`
});
Vue.component('orders-section', {
    template: `
    <transition name="slide-fade">
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
    Orders
    </div>
    </transition>`
});
Vue.component('cart-section', {
    template: `
    <transition name="slide-fade">
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-center">
    Cart
    </div>
    </transition>`
});
/** END PAGINE INTERNE **/