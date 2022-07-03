import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import with an @ symbol are resolved by vite to ./src directory

import App from '@/App.vue' // import the main app component
import router from '@/router' // import the router
import smileconfig from '@/plugins/smileconfig' // this provides access to the config globally
import '@/icons' // configure fontawesome

// Create the app and the data store
const app = createApp(App) // create the app
const pinia = createPinia() // create the data store

// register plugins
app.use(pinia) // tell the app to use the data store
app.use(router) // tell the app to use the router
app.use(smileconfig) // register plugin.  this provides a variable smileconfig in all components

// load any global components (these will be available in all other components)
app.component('fa-icon', FontAwesomeIcon)
app.mount('#app') // start the app!
// you "mount the app starting at the #app element"
