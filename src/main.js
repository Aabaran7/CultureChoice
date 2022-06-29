/* eslint-disable no-unused-vars */
import { createApp } from 'vue'

import { createPinia } from 'pinia'

import router from '@/router.js'
import App from '@/App.vue'
import smileconfig from '@/plugins/smileconfig'

// 5. Create and mount the root instance.
const app = createApp(App)
const pinia = createPinia()

// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(pinia)
app.use(router)
app.use(smileconfig) // register plugin.  this provides a variable smileconfig in all components

app.mount('#app') // start the app!
