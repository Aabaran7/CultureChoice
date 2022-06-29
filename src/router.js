import { createRouter, createWebHashHistory } from 'vue-router'
import useSmileStore from '@/stores/smiledata'

// 1. Define route components.
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

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  history: createWebHashHistory(), // We are using the hash history for now/simplicity
  routes,
})

function addGuards(r) {
  r.beforeEach((to, from) => {
    // check what the
    console.log('before the route', to.name)
    const smileStore = useSmileStore()
    console.log(smileStore.local)
    console.log('is user known?', smileStore.isKnownUser)
    if (!smileStore.isKnownUser) {
      // not isKnownUser
      console.log('not known user')
      console.log('calling setknown')
      smileStore.known()
      console.log('is user known?', smileStore.isKnownUser)
      // smileStore.setLastRoute('home')
      if (to.name === 'home') {
        return true // good
      }
      return { name: smileStore.lastRoute, replace: true } // go to last route
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

  r.afterEach((to, from) => {
    const smileStore = useSmileStore()
    console.log('setting last route to ', to.name)
    smileStore.setLastRoute(to.name)
  })
}

addGuards(router)

export { routes, addGuards }

export default router
