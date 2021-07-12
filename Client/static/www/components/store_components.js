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

var ORDERS;
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
        },
        getOrders() {
            let self = this;
            sendRequest('GET', '/order', {
                user_id: window.localStorage.user_id
            }, json => {
                if (json.error_code) {
                    console.log(json.error_desc);
                } else {
                    self.orders = json.result;
                }
            });
        },
        totalPrice(order) {
            return parseFloat(order.quantity * order.product.price).toFixed(2);
        },
        formatTimestamp(timestamp) {
            const a = new Date(timestamp);
            var months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
            var days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var day = days[a.getDay()];
            //var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
            var time = {
                year: year,
                month: month,
                date: date,
                hour: hour,
                min: min,
                sec: sec,
                day: day
            };
            return time.date + ' ' + time.month + ' ' + time.year;
        }
    },
    computed: {

    },
    mounted() {
        ORDERS = this;
        this.getOrders();
    },
    template: `
        <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-start">
        <section-header title="Ordini" subtitle="Vedi i tuoi ordini"></section-header>
        <div v-if="orders.length == 0" class="text-white text-md h-full w-full text-center font-normal flex flex-col justify-center">
            Non ci sono ordini
            <span class="cursor-pointer font-bold" @click="goToCart()">Vai al catalogo</span>
        </div>
        <div v-else>
            <div v-for="order in orders" class="w-10/12 bg-light mx-auto my-2 rounded-xl flex flex-row flex-wrap py-5">

                <div class="cursor-pointer w-1/3 flex text-center flex-col justify-center">
                    <img class="h-auto w-auto mx-4" :src="order.product.picture">
                </div>
                <div class="cursor-pointer w-2/3 flex text-left flex-col justify-center">
                    <span class="text-white text-sm font-bold"><span class="text-green-300 font-bold">{{order.quantity}}x </span>{{order.product.name}}</span>
                    <span class="text-white text-2xl font-normal">€ {{totalPrice(order)}}</span>
                    <span class="text-green-300 text-md font-normal">{{order.status.label}}</span>
                    <span class="text-white text-sm font-normal">{{formatTimestamp(order.timestamp)}}</span>
                </div>

            </div>


        </div>
        </div>`
});
Vue.component('cart-section', {
    props: ['cart'],
    data() {
        return {
            payment: false,
            stripe: null,
            user: {},
            card: null
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
        checkout_old() {
            let self = this;
            sendRequest('POST', '/create-checkout-session', {
                cart: self.cart,
                user_id: window.localStorage.user_id
            }, function (obj) {
                return self.stripe.redirectToCheckout({
                    sessionId: obj.result.session_id
                }).then(function (result) {
                    if (result.error) {
                        app.alertPresent('Errore elaborazione', result.error.message);
                    }
                });
            });
        },
        checkout() {
            app.loaderPresent();
            var form = document.getElementById('payment_form');
            let fd = new FormData(form);
            var object = {};
            fd.forEach((value, key) => object[key] = value);
            object.cart = this.cart;
            object.user_id = window.localStorage.user_id;
            var self = this;

            sendRequest('POST', '/stripe-payment-intent', object, json => {
                app.loaderPresent();
                if (json.error_code) {
                    app.alertPresent('Errore', json.error_desc, 'ok');
                    app.loaderDismiss();
                } else {
                    const clientSecret = json.result.client_secret;
                    self.stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card: this.card,
                            billing_details: {
                                name: object.name
                            }
                        }
                    }).then(function (result) {
                        if (result.error) {
                            // Show error to your customer (e.g., insufficient funds)
                            console.log(result.error.message);
                            app.alertPresent('Errore', result.error.message, 'ok');
                            ORDERS.getOrders();
                        } else {
                            // The payment has been processed!
                            if (result.paymentIntent.status === 'succeeded') {
                                app.alertPresent('Successo', 'Pagamento andato a buon fine', 'ok');
                                ORDERS.getOrders();
                                STORE.cart = [];
                                if (STORE.cart != [])
                                    window.localStorage.cart = JSON.stringify(STORE.cart);
                                STORE_SELECTOR.changeMap(STORE_SELECTOR.sections[1]);
                                self.cancelPayment();
                            }
                        }
                        app.loaderDismiss();
                    });
                }
            });

        },
        pay() {
            this.payment = true;
            let stripe = this.stripe;
            var elements = stripe.elements();
            var style = {
                base: {
                    color: "white",
                }
            };

            this.card = elements.create("card", {
                style: style
            });

            this.card.on('change', function (event) {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });

            let self = this;
            setTimeout(() => {
                self.card.mount("#card-element");
            }, 1000);


        },
        cancelPayment() {
            this.card = null;
            this.clientSecret = null;
            this.payment = false;
        }
    },
    mounted() {
        this.stripe = Stripe('pk_test_YmmQsGhT16UwyRWxaOcd7Eyf00xYOJoN5y');
        sendRequest('GET', '/user', {
            user_id: window.localStorage.user_id
        }, obj => {
            if (obj.error_code)
                app.alertPresent("Errore", obj.error_desc, 'Ok');
            else
                this.user = obj.result
        });
    },
    computed: {
        cartTotalValue() {
            let total = 0;
            this.cart.forEach(item => {
                total += item.product.price * item.quantity;
            });
            return parseFloat(total).toFixed(2);
        },
        cartTotal() {
            return "Totale carrello: <b>€ " + this.cartTotalValue + "</b>";
        },
        cartTitle() {
            return this.payment ? 'Checkout' : 'Carrello';
        },
        name() {
            if (!this.user.hasOwnProperty('name')) return '';
            return this.user.name + ' ' + this.user.surname;
        },
        address() {
            if (!this.user.hasOwnProperty('address')) return '';
            return this.user.address;
        }
    },
    template: `
        <div class="relative top-0 left-0 h-full w-full bg-dark text-white text-center font-bold flex flex-col justify-between pb-4">
            <section-header :title="cartTitle" :subtitle="cartTotal"></section-header>
            
            <template v-if="!payment">
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
                <flat-button @click="pay()" class="mb-2" v-if="cart.length > 0" label="vai al pagamento" mode="light"></flat-button>
                <div v-show="cart.length == 0" class="text-white text-md h-full w-full text-center font-normal flex flex-col justify-center">
                    Il carrello è vuoto
                    <span class="cursor-pointer font-bold" @click="goToCart()">Vai al catalogo</span>
                </div>
            </template>

            <template v-else-if="payment">
                <span class="flex flex-col justify-between h-full">
                    <form id="payment_form" method="POST">
                        <input-field class="hidden" name="subtotal" label="Totale" placeholder="" :value="cartTotalValue" type="text"></input-field>
                        <input-field name="name" label="Nominativo" placeholder="" :value="name" type="text"></input-field>
                        <input-field name="cf" label="Codice Fiscale/P. IVA" placeholder="" value="" type="text"></input-field>
                        <input-field name="address" label="Indirizzo" placeholder="" :value="address" type="text"></input-field>
                        
                        <div class="relative w-full text-left text-white flex flex-col justify-center px-8 my-2">
                            <div id="card-element" class="placeholder-dark placeholder-opacity-60 bg-light my-1 px-4 py-6 border-none focus:outline-none rounded-2xl text-lg font-semibold">
                                <!-- Elements will create input elements here -->
                            </div>
                        </div>

                        <!-- We'll put the error messages in this element -->
                        <div class="relative w-full text-left text-white flex flex-col justify-center px-8 my-2">
                            <div id="card-errors" role="alert" class="placeholder-dark placeholder-opacity-60 bg-transparent my-1 px-4 py-6 border-none focus:outline-none rounded-2xl text-red-200 text-lg text-center font-semibold"></div>
                        </div>
                    
                    </form>
                    <span>
                        <flat-button @click="checkout()" label="paga" class="mb-1"></flat-button>
                        <div @click="cancelPayment()" class="cursor-pointer mt-0 mb-4 p-3 text-white text-md">annulla</div>
                    </span>
                </span>
        </template>


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