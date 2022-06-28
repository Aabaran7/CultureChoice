/* eslint-disable no-unused-vars */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

import App from '@/App.vue'
import smileconfig from '@/plugins/smileconfig'
import appconfig from '@/config'

import router from '@/router.js'

// 5. Create and mount the root instance.
const app = createApp(App)
const pinia = createPinia()

// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(smileconfig, {}) // register plugin.  this provides a variable smileconfig in all components
app.use(pinia)
app.use(router)

app.mount('#app') // start the app!
