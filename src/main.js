import './assets/main.css'
import './style.css'

import Modal from "@/components/Modal.vue";
import ModalC from "@/components/ModalC.vue";
import ModalR from "@/components/ModalR.vue";
import Progressbar from "@/components/Progressbar.vue";

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
// import mixin from '@/libs/mixin'

const app = createApp(App)

app.use(createPinia())

app.component("font-awesome-icon", FontAwesomeIcon)
app.component("ModalC", ModalC)
app.component("ModalR", ModalR)
app.component('v-select', vSelect)
app.component("ProgressBar", Progressbar)

app.use(
    VueTippy,
    // optional
    {
        directive: 'tippy', // => v-tippy
        component: 'tippy', // => <tippy/>
    }
)

app.use(Toast);
app.use(router)

// app.config.globalProperties.$mixin = mixin;

app.mount('#app')
