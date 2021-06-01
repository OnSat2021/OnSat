/** MAIN **/

var STORE, STORE_SELECTOR;

Vue.component('route-store', {
    data() {
        return {
            /** ROUTING **/
            currentSection: window.location.pathname,
            /** CART **/
            cart: [],
            products: [],
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
        updateCart(product, quantity) {
            app.loaderPresent("Aggiungo al carrello");
            let cart_item = {
                "product": product,
                "quantity": quantity
            };

            let added = false;
            this.cart.forEach(item => {
                if (item.product.id == product.id) {
                    item.quantity += quantity;
                    added = true;
                }
            });
            if (!added)
                this.cart.push(cart_item);

            if (this.cart != [])
                window.localStorage.cart = JSON.stringify(this.cart);
            else
                window.localStorage.removeItem('cart');

            app.loaderDismiss();
        },
        removeFromCart(item) {
            let i = 0;
            this.cart.forEach(it => {
                if (it.product.id == item.product.id) {
                    if (it.quantity > 1) {
                        it.quantity--;
                    } else {
                        this.cart.splice(i, 1);
                    }
                }
                i++;
            });

            if (this.cart != [])
                window.localStorage.cart = JSON.stringify(this.cart);
            else
                window.localStorage.removeItem('cart');
        },
        updateProductSelection(product) {
            this.selectedProduct = product;
        }
    },
    mounted() {
        this.currentSection = "/";
        STORE = this;

        sendRequest('GET', '/data/products', {}, res => {
            if (res.error_code) {
                app.alertPresent('Errore', res.error_desc, 'Ok');
                return;
            }
            STORE.products = res.result;
        });

        if (window.localStorage.cart)
            this.cart = JSON.parse(window.localStorage.cart);
    },
    computed: {},
    template: `
        <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
            
            <catalog-section class="section" v-show="checkSection('/catalog')"
                @update-product-selection="updateProductSelection"
                @add-to-cart="updateCart"
                :selected-product="selectedProduct"
                :products="products">
            </catalog-section>

            <orders-section class="section" v-show="checkSection('/orders')"></orders-section>
            <cart-section class="section"
                @update-cart="updateCart"
                :cart="cart"
                @remove-from-cart="removeFromCart"
                v-show="checkSection('/cart')">
            </cart-section>
            <store-selector class="selector" @update-section="updateCurrentSection"></store-selector>
        </div>`
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
    mounted() {
        STORE_SELECTOR = this;
    },
    created,
    template: `
        <div class="select-none flex flex-row h-10 w-full bg-dark absolute top-0 left-0 justify-center">
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
    <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
        <section-header title="Catalogo" subtitle="Scopri i nostri prodotti"></section-header>
        <product-card v-for="product in products" :key="product.id" :product="product" :selected-product="selectedProduct" ></product-card>
    </div>`
});
Vue.component('orders-section', {
    data() {
        return {
            orders: []
        }
    },
    methods: {
        goToCart() {
            console.log(STORE_SELECTOR);
            STORE_SELECTOR.changeMap(STORE_SELECTOR.sections[0]);
        }
    },
    template: `
        <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
        <section-header title="Ordini" subtitle="Vedi i tuoi ordini"></section-header>
        <div v-show="orders.length == 0" class="text-white text-md h-full w-full text-center font-normal flex flex-col justify-center">
            Non ci sono ordini
            <span class="cursor-pointer font-bold" @click="goToCart()">Vai al catalogo</span>
        </div>
        </div>`
});
Vue.component('cart-section', {
    props: ['cart'],
    data() {
        return {
            stripe: null
        }
    },
    methods: {
        totalPrice(item) {
            tot = parseFloat(item.product.price).toFixed(2) * parseFloat(item.quantity).toFixed(2);
            return parseFloat(tot).toFixed(2);
        },
        removeFromCart(item) {
            this.$emit('remove-from-cart', item);
        },
        goToCart() {
            console.log(STORE_SELECTOR);
            STORE_SELECTOR.changeMap(STORE_SELECTOR.sections[0]);
        },
        checkout() {
            let self = this;
            sendRequest('POST', '/create-checkout-session', {
                cart: self.cart,
                user_id: window.localStorage.user_id
            }, function (obj) {
                return self.stripe.redirectToCheckout({
                    sessionId: obj.result.session_id
                }).then(function (result) {
                    // If `redirectToCheckout` fails due to a browser or network
                    // error, you should display the localized error message to your
                    // customer using `error.message`.
                    if (result.error) {
                        app.alertPresent('Errore elaborazione', result.error.message);
                    }
                });
            });
        }
    },
    mounted() {
        this.stripe = Stripe('pk_test_YmmQsGhT16UwyRWxaOcd7Eyf00xYOJoN5y');
    },
    computed: {
        cartTotal() {
            let total = 0;
            this.cart.forEach(item => {
                total += item.product.price * item.quantity;
            });
            return "Totale carrello: <b>€ " + parseFloat(total).toFixed(2) + "</b>";
        }
    },
    template: `
        <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
            <section-header title="Carrello" :subtitle="cartTotal"></section-header>
            <div v-for="item in cart">
                <div class="w-10/12 bg-light mx-auto my-2 rounded-xl flex flex-row flex-wrap py-5 relative">
                    <div class="w-1/2 flex text-center flex-col justify-center">
                        <img class="h-auto w-auto mx-4" :src="item.product.picture">
                    </div>
                    <div class="w-1/2 flex text-left flex-col justify-center">
                        <span class="text-white text-sm font-bold"><span class="text-lg text-green-300">{{item.quantity}}x</span> {{item.product.name}}</span>
                        <span class="text-white text-2xl font-normal">€ {{totalPrice(item)}}</span>
                        <span class="text-white text-sm font-bold">€ {{item.product.price}} cad.</span>
                    </div>
                    <span class="cursor-pointer absolute top-0 right-0 -mt-2 -mr-2 text-red-500 bg-white rounded-3xl p-2 material-icons" @click="removeFromCart(item)">delete</span>
                </div>
            </div>
            <flat-button @click="checkout()" class="mb-2" v-if="cart.length > 0" label="vai al pagamento" mode="light"></flat-button>
            <div v-show="cart.length == 0" class="text-white text-md h-full w-full text-center font-normal flex flex-col justify-center">
                Il carrello è vuoto
                <span class="cursor-pointer font-bold" @click="goToCart()">Vai al catalogo</span>
            </div>
        </div>`
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
                this.$parent.$emit("update-product-selection", (product == this.selectedProduct) ? null : product)
        },
        incQuantity() {
            if (this.quantity < this.product.available)
                this.quantity++;
        },
        decQuantity() {
            if (this.quantity > 1)
                this.quantity--;
        },
        updateCart() {
            console.log("emetto evento add-to-cart");
            this.$parent.$emit("add-to-cart", this.product, this.quantity);
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
        <div class="w-10/12 bg-light mx-auto my-2 rounded-xl flex flex-row flex-wrap pt-5" :class="{'py-5':(!selected)}">

            <div @click="toggleSelection(product)" class="cursor-pointer w-1/2 flex text-center flex-col justify-center">
                <img class="h-auto w-auto mx-4" :src="product.picture">
            </div>
            <div @click="toggleSelection(product)" class="cursor-pointer w-1/2 flex text-left flex-col justify-center">
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
                        <span class="cursor-pointer material-icons" :class="{'text-gray-500':(quantity <= 1)}" @click="decQuantity()">
                            remove_circle
                        </span>
                        <div class="bg-dark rounded-md mx-8 px-4">{{quantity}}</div>
                        <span class="cursor-pointer material-icons" :class="{'text-gray-500':(quantity >= product.available)}" @click="incQuantity()">
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
                <flat-button class="mb-2" v-if="selected && available" label="aggiungi al carrello" @click="updateCart()" mode="light"></flat-button>
            </div>
        </div>
    `
});