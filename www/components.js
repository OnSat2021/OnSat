app.component('loader', {
    props: ['loader'],
    template: `<div class="loader">
        <img v-bind:src="loader.picture">
        <h3>{{loader.message}}</h3>
    </div>`
});

app.component('alert', {
    props: ['alert'],
    template: `<div class="alert">
        <h2>{{alert.message}}</h2>
        <h3>{{alert.body}}</h3>
        <br>
        <slot></slot>
    </div>`
});

app.component('flat-button', {
    props: ['label', 'dark'],
    template: `<div class="flat-button" :class="{'dark':'dark'}">
        <h3>{{label}}</h3>
    </div>`
});

app.component('backdrop', {
    template: `<div class="backdrop"></div>`
});


app = app.mount('#app');