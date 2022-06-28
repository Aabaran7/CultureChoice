import { createRouter, createWebHashHistory } from 'vue-router'
import useSmileStore from '@/stores/smiledata'

// 1. Define route components.
import Advertisement from '@/components/pages/Advertisement.vue'
import Captcha from '@/components/pages/Captcha.vue'
import Consent from '@/components/pages/Consent.vue'
import Exp from '@/components/pages/Exp.vue'
import Debrief from '@/components/pages/Debrief.vue'
import Thanks from '@/components/pages/Thanks.vue'
import Config from '@/components/pages/Config.vue'

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

export default router
