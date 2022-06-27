import * as Vue from 'vue'
import * as VueRouter from 'vue-router'
import { createPinia } from 'pinia'
import { useSmileStore } from '@/stores/smiledata'

import App from './App.vue'
import smileconfig from './plugins/smileconfig'

// 1. Define route components.
import Config from './components/pages/Config.vue'
import Advertisement from './components/pages/Advertisement.vue'


// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
const routes = [
   { path: '/', component: Config },
//   { path: '/captcha', component: Captcha },
//   { path: '/consent', component: InformedConsent },
//   { path: '/exp', component: Exp},
//   { path: '/debreif', component: Debrief},
//   { path: '/thanks', component: Thanks },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
});


// 5. Create and mount the root instance.
const app = Vue.createApp(App)
const pinia = createPinia()
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router)
app.use(pinia)
app.use(smileconfig, {}) // register plugin.  this provides a variable smileconfig in all components

const smileStore = useSmileStore()

smileStore.$subscribe((mutation, state) => {
    // something changed do now do the update
    // update local store
    // update firebase
    console.log(state.counter)    
    console.log('smileStore mutation: ', mutation)
})

app.mount('#app')  // start the app!
