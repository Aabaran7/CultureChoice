// import { ref } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import appconfig from '@/config'

// 1. Import route components
import RecruitmentChooser from '@/components/pages/RecruitmentChooserPage.vue'
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
    path: appconfig.mode === 'development' ? '/welcome' : '/',
    name: 'welcome',
    component: Advertisement,
    meta: { progress: (100 * routeIndex++) / totalNonConfigRoutes },
    beforeEnter: (to, from) => {
      console.log("hi, i'm loading the welcome page")
      // before loading this route, identify the user
      const smilestore = useSmileStore()
      // if (!smilestore.isKnownUser) {
      //   console.log('not known')
      //   smilestore.setKnown() // set new user and add document
      // }
      // and process the data
      const urlParams = to.query
      console.log('router query', to.query)
      // console.log(window.location.search)
      // smilestore.setSearchParams(window.location.search)

      // const urlParams = new URLSearchParams(window.location.search)

      if (
        urlParams.PROLIFIC_PID &&
        urlParams.STUDY_ID &&
        urlParams.SESSION_ID
      ) {
        // this is a prolific experiment
        console.log('prolific mode')
        smilestore.setProlific(
          urlParams.PROLIFIC_PID,
          urlParams.STUDY_ID,
          urlParams.SESSION_ID
        )
      } else if (
        urlParams.assignmentId &&
        urlParams.hitId &&
        urlParams.workerId
      ) {
        if (urlParams.assignmentId == 'ASSIGNMENT_ID_NOT_AVAILABLE') {
          console.log('AMT mode, but no assignment (preview mode)')
          // supposed to show the ad here
        } else {
          console.log('AMT mode, with assignment')
          smilestore.setMechanicalTurk(
            urlParams.workerId,
            urlParams.hitId,
            urlParams.assignmentId
          )
        }
      } else if (
        urlParams.CITIZEN_ID &&
        urlParams.CITIZEN_TASK_ID &&
        urlParams.CITIZEN_ASSIGN_ID
      ) {
        console.log('future citizen mode')
        smilestore.setCitizen(
          urlParams.CITIZEN_ID,
          urlParams.CITIZEN_TASK_ID,
          urlParams.CITIZEN_ASSIGN_ID
        )
      } else {
        console.log('development mode')
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
    // beforeEnter: (to, from) => {
    //   // before loading this route, identify the user
    //   const smilestore = useSmileStore()
    //   if (!smilestore.isKnownUser) {
    //     console.log('not known')
    //     smilestore.setKnown() // set new user and add document
    //   }
    // },
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

// const smilestore = useSmileStore()
// add the recruitment option if in development mode
if (appconfig.mode === 'development') {
  routes.unshift({
    path: '/',
    name: 'recruit',
    component: RecruitmentChooser,
  })
}

// 3. add navigation guards
//    currently these check if user is known
//    and if they are, they redirect to last route
function addGuards(r) {
  r.beforeEach((to) => {
    const smilestore = useSmileStore()

    if (
      (to.name === 'recruit' && smilestore.config.mode === 'development') ||
      to.name === 'config' ||
      (smilestore.local.allowJumps && smilestore.config.mode === 'development')
    ) {
      return true // allow the requested route to load
    }

    // if not known and requesting welcome
    if (!smilestore.isKnownUser) {
      if (to.name === 'welcome' || to.name === 'consent') {
        // if requesting welcome, allow it
        return true // allow the requested route to load
      }
      console.log('screwed up', to.name)
      console.log('LAAAST route', smilestore.local.lastRoute)
      if (smilestore.local.lastRoute === 'consent') {
        return { name: 'consent', replace: true } // redirect to welcome
      }
      console.log('go to welcome')
      return { name: 'welcome', replace: true } // redirect to welcome
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

  // not used but available
  r.afterEach((to, from) => {
    const smilestore = useSmileStore()
    if (
      to.name === 'welcome' &&
      from.name === undefined &&
      smilestore.config.mode === 'development'
    ) {
      console.log('setting last route to ', to.name)
      smilestore.setLastRoute(to.name)
    }
    console.log('after each', to.name, from.name)
    // if (smilestore.searchParams) {
    //   to.query = smilestore.searchParams
    // }
  })
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
