import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import router from '@/router'
import App from '@/App.vue'
import smileconfig from '@/plugins/smileconfig'

import '@/icons'

// 5. Create and mount the root instance.
const app = createApp(App)
const pinia = createPinia()

// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(pinia)
app.use(router)
app.use(smileconfig) // register plugin.  this provides a variable smileconfig in all components

app.component('fa-icon', FontAwesomeIcon)
app.mount('#app') // start the app!
