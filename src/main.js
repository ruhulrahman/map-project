import './assets/main.css'
import './style.css'

import Modal from "@/components/Modal.vue";
import ModalR from "@/components/ModalR.vue";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import VueTippy from 'vue-tippy'

import Toast from 'vue-toastification'
// import the CSS or use your own!
import 'vue-toastification/dist/index.css'

library.add(fas, far, fab)

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.component("font-awesome-icon", FontAwesomeIcon)
app.component("ModalC", Modal)
app.component("ModalR", ModalR)
app.component('v-select', vSelect)

app.use(
    VueTippy,
    // optional
    {
        directive: 'tippy', // => v-tippy
        component: 'tippy', // => <tippy/>
    }
)

app.use(Toast);

app.use(createPinia())
app.use(router)

app.mount('#app')
