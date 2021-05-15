/** MAIN **/

Vue.component('route-store', {
    data() {
        return {
            /** ROUTING **/
            currentSection: window.location.pathname,
            /** CART **/
            cart: [],
            products: [{
                    "id": "prod_0001",
                    "name": "All Road Plus",
                    "price": "1469,90",
                    "picture": "./src/imgs/all-road.png",
                    "description": "Proin vel lorem eget nunc aliquam ultrices non sodales nunc. Pellentesque vel dapibus felis. Aliquam vitae ligula imperdiet, tempor risus vel, sollicitudin nibh. ",
                    "available": 8
                },
                {
                    "id": "prod_0003",
                    "name": "Cestino portapacchi",
                    "price": "24,90",
                    "picture": "./src/imgs/all-road.png",
                    "description": "Proin vel lorem eget nunc aliquam ultrices non sodales nunc. Pellentesque vel dapibus felis. Aliquam vitae ligula imperdiet, tempor risus vel, sollicitudin nibh. ",
                    "available": 0
                },
                {
                    "id": "prod_0002",
                    "name": "Batteria 48 V",
                    "price": "389,90",
                    "picture": "./src/imgs/all-road.png",
                    "description": "Proin vel lorem eget nunc aliquam ultrices non sodales nunc. Pellentesque vel dapibus felis. Aliquam vitae ligula imperdiet, tempor risus vel, sollicitudin nibh. ",
                    "available": 4
                },
                {
                    "id": "prod_0004",
                    "name": "Zainetto On",
                    "price": "19,90",
                    "picture": "./src/imgs/all-road.png",
                    "description": "Proin vel lorem eget nunc aliquam ultrices non sodales nunc. Pellentesque vel dapibus felis. Aliquam vitae ligula imperdiet, tempor risus vel, sollicitudin nibh. ",
                    "available": 2
                }
            ],
            selectedProduct: null
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
        /** CART **/
        updateCart(product) {
            cart.push(product);
        },
        updateProductSelection(product) {
            this.selectedProduct = product;
        }
    },
    mounted() {
        this.currentSection = "/";
    },
    template: `
    <transition name="slide-fade">
        <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-start">
            <catalog-section class="section" v-show="checkSection('/catalog')" @update-product-selection="updateProductSelection" :selected-product="selectedProduct" :products="products"></catalog-section>
            <orders-section class="section" v-show="checkSection('/orders')"></orders-section>
            <cart-section class="section" v-on:update-cart="updateCart" v-show="checkSection('/cart')"></cart-section>
            <store-selector class="selector" @update-section="updateCurrentSection"></store-selector>
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
    props: ['products', 'selectedProduct'],
    template: `
    <transition name="slide-fade">
    <div class="relative top-0 left-0 h-full w-screen bg-dark text-white text-center font-bold flex flex-col justify-start">
        <section-header title="Catalogo" subtitle="Scopri i nostri prodotti"></section-header>
        <product-card v-for="product in products" :product="product" :selected-product="selectedProduct" ></product-card>
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


Vue.component('product-card', {
    props: ['product', 'selectedProduct'],
    data: function () {
        return {
            quantity: 1
        }
    },
    methods: {
        toggleSelection(product) {
            if (this.available)
                this.$parent.$emit("update-product-selection", product)
        },
        incQuantity() {
            if (this.quantity < this.product.available)
                this.quantity++;
        },
        decQuantity() {
            if (this.quantity > 1)
                this.quantity--;
        }
    },
    computed: {
        selected: function () {
            if (this.selectedProduct == null)
                return false;
            return this.selectedProduct.id == this.product.id
        },
        available: function () {
            return this.product.available > 0;
        }
    },
    template: `
        <div class="w-10/12 bg-light mx-auto my-2 rounded-xl flex flex-row flex-wrap py-5" @click="toggleSelection(product)">
            <div class="w-1/2 flex text-center flex-col justify-center">
                <img class="h-auto w-auto mx-4" :src="product.picture">
            </div>
            <div class="w-1/2 flex text-left flex-col justify-center">
                <span class="text-white text-sm font-bold">{{product.name}}</span>
                <span class="text-white text-2xl font-normal">€ {{product.price}}</span>
                <span v-if="!selected && available" class="text-green-300 text-md font-normal">{{product.available}} disponibili</span>
                <span v-if="!selected && !available" class="text-red-300 text-md font-normal">Esaurito</span>
            </div>

            <div class="w-full text-center">
                <div v-if="selected" class="text-white text-md text-left p-8 font-normal leading-none mb-1" v-html="product.description"></div>
                <div v-if="selected && available" class="text-white text-sm text-center p-4 font-semibold leading-none mt-1 mb-2">
                    Quantità
                    <div class="mx-auto flex flex-row justify-center text-lg text-center text-white mt-4">
                        <span class="material-icons" :class="{'text-gray-500':(quantity <= 1)}" @click="decQuantity()">
                            remove_circle
                        </span>
                        <div class="bg-dark rounded-md mx-8 px-4">{{quantity}}</div>
                        <span class="material-icons" :class="{'text-gray-500':(quantity >= product.available)}" @click="incQuantity()">
                            add_circle
                        </span>
                    </div>
                </div>
                <div v-if="selected && available" class="text-green-300 text-md text-center font-normal leading-none my-4">
                    Disponibili {{product.available}} unità.
                </div>
                <div v-if="selected && !available" class="text-red-300 text-md text-center font-normal leading-none my-4">
                    Prodotto al momento non disponibile.
                </div>
                <span v-if="!selected && available && false" class="material-icons text-white text-lg mb-2">
                    expand_more
                </span>
                <flat-button class="mb-2" v-if="selected && available" label="aggiungi al carrello" mode="light"></flat-button>
            </div>
        </div>
    `
})