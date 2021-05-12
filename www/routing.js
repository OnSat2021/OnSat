var Home = {
    template: `<transition name="slide-fade">
    <div v-if="true" class="full-screen bg-green">Home</div>
    </transition>`
};


var Map = Vue.component('Map', {
        data: function() {
            return {
                showwo: "cazzo"
            }
        },
        computed: {
            shower: 0
        },
        mounted: function() {
            console.log("FALZO");
            setTimeout(function() {
                console.log(this);
                this.showwo = "finocchio";
            }, 1000);
        },
        template: `<transition name="slide-fade"><div v-if="showwo" class="full-screen bg-white">Map {{show}}</div></transition>`,
    })
    /*
    var Map = {
        data: function() {
            return {
                show: "cazzo"
            }
        },
        mounted: function() {
            console.log("FALZO");
            setTimeout(function() {
                console.log(self);
                Map.show = "finocchio";
            }, 1000);
        },
        template: `<transition name="slide-fade"><div v-if="show" class="full-screen bg-white">Map {{show}}</div></transition>`,
    };*/
var Paths = {
    template: `<transition name="slide-fade"><div v-if="true" class="full-screen bg-white">Paths</div></transition>`,
};
var Store = {
    template: `<transition name="slide-fade"><div v-if="true" class="full-screen bg-blue">Store</div></transition>`,
};
var Login = {
    template: `<transition name="slide-fade"><div v-if="true" class="full-screen bg-red">Login</div></transition>`,
};
var NotFound = {
    template: `<transition name="slide-fade"><div v-if="true" class="full-screen bg-red">NotFound</div></transition>`,
};

const routes = {
    '/': Home,
    '/map': Map,
    '/paths': Paths,
    '/store': Store,
    '/signin': Login
}