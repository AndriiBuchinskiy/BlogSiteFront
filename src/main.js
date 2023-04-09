import { createApp } from 'vue'
import App from './App.vue'
import router from "/src/router/router";
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import axios from "axios";

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import vfmPlugin from 'vue-final-modal'


const vuetify = createVuetify({
    components,
    directives,
})
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App);
app
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(vfmPlugin)
    app.config.globalProperties.axios = axios;
    app.mount('#app')
