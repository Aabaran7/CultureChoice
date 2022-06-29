import { createRouter, createWebHashHistory } from 'vue-router'
import useSmileStore from '@/stores/smiledata'

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
      // const smileStore = useSmileStore()
      // smileStore.trials += 1
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
    // check what the
    const smileStore = useSmileStore()
    if (!smileStore.isKnownUser) {
      // not isKnownUser
      smileStore.setKnown()
      if (to.name === 'home') {
        return true // good
      }
      return { name: smileStore.lastRoute, replace: true } // go to last route
    }
    if (smileStore.lastRoute === to.name) {
      return true
    }
    return { name: smileStore.lastRoute, replace: true }
  })

  r.afterEach((to) => {
    const smileStore = useSmileStore()
    smileStore.setLastRoute(to.name)
  })
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
