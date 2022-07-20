// import { ref } from 'vue'
import '@/seed.js' // random number seed
import { createRouter, createWebHashHistory } from 'vue-router'
import useSmileStore from '@/stores/smiledata' // get access to the global store

// 1. Import route components
import Advertisement from '@/components/pages/AdvertisementPage.vue'
import Consent from '@/components/pages/ConsentPage.vue'
import DemographicSurvey from '@/components/pages/DemographicSurveyPage.vue'
import Captcha from '@/components/pages/CaptchaPage.vue'
import Instructions from '@/components/pages/InstructionsPage.vue'
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
const totalNonConfigRoutes = 7
let routeIndex = 0
const routes = [
  {
    path: '/',
    name: 'home',
    component: Advertisement,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
    beforeEnter: (to, from) => {
      // before loading this route, identify the user
      const smilestore = useSmileStore()
      if (!smilestore.isKnownUser) {
        smilestore.setKnown() // set new user and add document
      }
    },
  },
  {
    path: '/consent',
    name: 'consent',
    component: Consent,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
  },
  {
    path: '/demograph',
    name: 'demograph',
    component: DemographicSurvey,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
  },
  {
    path: '/captcha',
    name: 'captcha',
    component: Captcha,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
  },
  {
    path: '/instructions',
    name: 'instructions',
    component: Instructions,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
  },
  {
    path: '/exp',
    name: 'exp',
    component: Exp,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
  },
  {
    path: '/debrief',
    name: 'debrief',
    component: Debrief,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
  },
  {
    path: '/thanks',
    name: 'thanks',
    component: Thanks,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
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
    const smilestore = useSmileStore()

    if (
      to.name === 'config' ||
      (smilestore.local.allowJumps && smilestore.config.mode === 'development')
    ) {
      return true // allow the requested route to load
    }

    // if not known and requesting home
    if (!smilestore.isKnownUser) {
      if (to.name === 'home') {
        // if requesting home, allow it
        return true // allow the requested route to load
      }
      return { name: 'home', replace: true } // redirect to home
    }

    // otherwise is known so check if database connected
    // if not connect and load existing data
    // if yes just continue
    if (smilestore.isKnownUser && !smilestore.isDBConnected) {
      smilestore.loadData()
    }

    if (smilestore.local.lastRoute === to.name) {
      return true // allow the requested route to load, prevent infinite redirects
    }

    // go to where you left off
    return {
      name: smilestore.lastRoute, // to go where you leave off
      replace: true,
    }
  })

  // after each route loads
  // r.afterEach((to) => {
  //   if (import.meta.env.MODE !== 'development') {
  //     // manually notify google analytics of page change
  //     ga('set', 'page', to.name)
  //     ga('send', 'pageview')
  //   }
  // })
}

// 4. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = createRouter({
  history: createWebHashHistory(), // We are using the hash history for now/simplicity
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

addGuards(router) // add the guards defined above
// they are defined in a function like this for the testing harness
export { routes, addGuards }

export default router
