import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

import useSmileStore from '@/stores/smiledata'

import App from '@/App.vue'
import smileconfig from '@/plugins/smileconfig'
import appconfig from '@/config.js'

// 1. Define route components.
import Advertisement from '@/components/pages/Advertisement.vue'
import Captcha from '@/components/pages/Captcha.vue'
import Consent from '@/components/pages/Consent.vue'
import Exp from '@/components/pages/Exp.vue'
import Debrief from '@/components/pages/Debrief.vue'
import Thanks from '@/components/pages/Thanks.vue'
import Config from '@/components/pages/Config.vue'

/*
async function startup() {
  // const smileStore = useSmileStore() // get access to the global store
  console.log(appconfig.firebaseConfig);
  const firebaseApp = initializeApp(appconfig.firebaseConfig);
  const db = getFirestore(firebaseApp);

  try {
    const docRef = await addDoc(collection(db, 'users'), {
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    });
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}
*/

// 2. Define some routes
// Each route should map to a component.
// Each needs a name
// We'll talk about nested routes later.
const routes = [
  {
    path: '/',
    name: 'home',
    component: Advertisement,
    beforeEnter: (to, from) => {
      const smileStore = useSmileStore()
      smileStore.trials += 1
    },
  },
  {
    path: '/captcha',
    name: 'captcha',
    component: Captcha,
  },
  {
    path: '/consent',
    name: 'consent',
    component: Consent,
  },
  {
    path: '/exp',
    name: 'exp',
    component: Exp,
  },
  {
    path: '/debrief',
    name: 'debrief',
    component: Debrief,
  },
  {
    path: '/thanks',
    name: 'thanks',
    component: Thanks,
  },
  {
    path: '/config',
    name: 'config',
    component: Config,
  },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  history: createWebHashHistory(), // We are using the hash history for now/simplicity
  routes,
})

// 5. Create and mount the root instance.
const app = createApp(App)
const pinia = createPinia()

// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(smileconfig, {}) // register plugin.  this provides a variable smileconfig in all components
app.use(pinia)
app.use(router)

router.beforeEach((to, from) => {
  // check what the
  console.log('before the route')
  const smileStore = useSmileStore()
  console.log(smileStore.isKnownUser)
  if (!smileStore.isKnownUser) {
    // not isKnownUser
    console.log('not known user')
    smileStore.setKnown()
    // smileStore.setLastRoute('home')
    if (to.name === 'home') {
      return true // good
    }
    return { name: smileStore.lastRoute, replace: true } // go to home
  }
  console.log('known user')
  console.log(smileStore.lastRoute)
  console.log(to.name)
  if (smileStore.lastRoute == to.name) {
    console.log('last route is home')
    return true
  }
  return { name: smileStore.lastRoute, replace: true }
})

router.afterEach((to, from) => {
  const smileStore = useSmileStore()
  console.log('setting last route to ', to.name)
  smileStore.setLastRoute(to.name)
})
/*
smileStore.$subscribe((mutation, state) => {
    // something changed do now do the update
    // update local store
    // update firebase
    console.log(state.counter)
    console.log('smileStore mutation: ', mutation)
})
*/

app.mount('#app') // start the app!
