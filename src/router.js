import { createRouter, createWebHashHistory } from 'vue-router'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import appconfig from '@/config' // need to import here because we aren't in a component

// 1. Import route components
import Advertisement from '@/components/pages/AdvertisementPage.vue'
import Captcha from '@/components/pages/CaptchaPage.vue'
import Consent from '@/components/pages/ConsentPage.vue'
import Exp from '@/components/pages/ExpPage.vue'
import Debrief from '@/components/pages/DebriefPage.vue'
import Thanks from '@/components/pages/ThanksPage.vue'
import Config from '@/components/pages/ConfigPage.vue'
// add new routes here.  generall these will be components/pages/

// 2. Define some routes
// Each route should map to a component.
// Each needs a name
// these routes can be accessed in any order generally
// but for most experiment they go in sequence from begining
// to the end of this list
const total_non_config_routes = 5
let route_index = 0
const routes = [
  {
    path: '/',
    name: 'home',
    component: Advertisement,
    meta: { progress: (100 * route_index++) / total_non_config_routes },
    beforeEnter: (to, from) => {
      // before loading this route, idenify the user
      const smileStore = useSmileStore()
      if (!smileStore.isKnownUser) {
        smileStore.setKnown()
      }
    },
  },
  {
    path: '/consent',
    name: 'consent',
    component: Consent,
    meta: { progress: (100 * route_index++) / total_non_config_routes },
  },
  {
    path: '/captcha',
    name: 'captcha',
    component: Captcha,
    meta: { progress: (100 * route_index++) / total_non_config_routes },
  },
  {
    path: '/exp',
    name: 'exp',
    component: Exp,
    meta: { progress: (100 * route_index++) / total_non_config_routes },
  },
  {
    path: '/debrief',
    name: 'debrief',
    component: Debrief,
    meta: { progress: (100 * route_index++) / total_non_config_routes },
  },
  {
    path: '/thanks',
    name: 'thanks',
    component: Thanks,
    meta: { progress: (100 * route_index++) / total_non_config_routes },
  },
  {
    path: '/config',
    name: 'config',
    component: Config, // this is a special route with config/debugging information
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
      (smileStore.local.allowJumps && appconfig.mode === 'development')
    ) {
      return true // allow the requested route to load
    }

    // if not known and requesting home
    if (!smileStore.isKnownUser) {
      if (to.name === 'home') {
        return true // allow the requested route to load
      }
      return { name: 'home', replace: true } // redirect to home
    }

    if (smileStore.local.lastRoute === to.name) {
      return true // allow the requested route to load, prevent infinite redirects
    }

    // this will cover known users
    // otherwise check if database exists TODO
    // and then go to where you left off
    // go to where you left off
    return {
      name: smileStore.lastRoute, // to go where you leave off
      replace: true,
    }
  })

  // not used but available
  // r.afterEach((to) => {
  //   console.log('after each', to.name)
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

addGuards(router) // add the guards defined above
// they are defined in a function like this for the testing harness
export { routes, addGuards }

export default router
