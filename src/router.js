import { createRouter, createWebHashHistory } from 'vue-router'
import useSmileStore from '@/stores/smiledata'
import appconfig from '@/config'

// 1. Import route components.
import Advertisement from '@/components/pages/AdvertisementPage.vue'
import Captcha from '@/components/pages/CaptchaPage.vue'
import Consent from '@/components/pages/ConsentPage.vue'
import Exp from '@/components/pages/ExpPage.vue'
import Debrief from '@/components/pages/DebriefPage.vue'
import Thanks from '@/components/pages/ThanksPage.vue'
import Config from '@/components/pages/ConfigPage.vue'

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
      if (!smileStore.isKnownUser) {
        smileStore.setKnown()
        // setup database
      }
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

// 3. add navigation guards
//    currently these check if user is known
//    and if they are, they redirect to last route
function addGuards(r) {
  r.beforeEach((to) => {
    const smileStore = useSmileStore()

    if (
      to.name === 'config' ||
      (smileStore.local.allowJumps && appconfig.mode == 'development')
    ) {
      return true
    }

    // if not known and requesting home
    if (!smileStore.isKnownUser) {
      if (to.name === 'home') {
        return true // great!
      }
      return { name: 'home', replace: true }
    }

    if (smileStore.local.lastRoute === to.name) {
      return true
    }
    // otherwise check if database exists
    // and then go to where you left off
    // go to where you left off
    return {
      name: smileStore.lastRoute,
      replace: true,
    }
  })

  // r.afterEach((to) => {
  //   console.log('after each', to.name)
  //   if (to.name !== 'config') {
  //     const smileStore = useSmileStore()
  //     console.log(to.name)
  //     smileStore.setLastRoute(to.name)
  //   }
  // })
}

// 4. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  history: createWebHashHistory(), // We are using the hash history for now/simplicity
  routes,
})

addGuards(router)

export { routes, addGuards }

export default router
