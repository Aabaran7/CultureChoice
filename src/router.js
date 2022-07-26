// import { ref } from 'vue'
import '@/seed.js' // random number seed
import { createRouter, createWebHashHistory } from 'vue-router'
// import useSmileStore from '@/stores/smiledata' // get access to the global store
import appconfig from '@/config'
import { processQuery } from '@/utils'
import Timeline from '@/timeline'

// 1. Import route components
import RecruitmentChooser from '@/components/pages/RecruitmentChooserPage.vue'
import MTurk from '@/components/pages/MTurkRecruitPage.vue'
import Advertisement from '@/components/pages/AdvertisementPage.vue'
import Consent from '@/components/pages/ConsentPage.vue'
import DemographicSurvey from '@/components/pages/DemographicSurveyPage.vue'
import Captcha from '@/components/pages/CaptchaPage.vue'
import Instructions from '@/components/pages/InstructionsPage.vue'
import Exp from '@/components/pages/ExpPage.vue'
import Debrief from '@/components/pages/DebriefPage.vue'
import Thanks from '@/components/pages/ThanksPage.vue'
import Config from '@/components/pages/ConfigPage.vue'
// add new routes here.  generally these will be things in components/pages/[something].vue

// 2. Define some routes to the timeline
// Each route should map to a component.
// Each needs a name
// these routes can be accessed in any order generally
// but for most experiment they go in sequence from begining
// to the end of this list
const timeline = new Timeline()

// add the recruitment chooser if in development mode
if (appconfig.mode === 'development') {
  timeline.pushNonSeqRoute({
    path: '/',
    name: 'recruit',
    component: RecruitmentChooser,
  })
} else {
  // auto refer to the anonymous welcome page
  timeline.pushNonSeqRoute({
    path: '/',
    name: 'landing',
    redirect: { name: 'welcome_anonymous' },
  })
}

// welcome screen for non-referral
timeline.pushSeqRoute({
  path: '/welcome',
  name: 'welcome_anonymous',
  component: Advertisement,
  meta: { next: 'consent' }, // override what is next
})

// welcome screen for referral
timeline.pushSeqRoute({
  path: '/welcome/:service',
  name: 'welcome_referred',
  component: Advertisement,
  meta: { next: 'consent' }, // override what is next
  beforeEnter: (to) => {
    processQuery(to.query, to.params.service)
  },
})

// consent
timeline.pushSeqRoute({
  path: '/consent',
  name: 'consent',
  component: Consent,
})

// demographic survery
timeline.pushSeqRoute({
  path: '/demograph',
  name: 'demograph',
  component: DemographicSurvey,
  // beforeEnter: (to, from) => {
  //   // before loading this route, identify the user
  //   const smilestore = useSmileStore()
  //   if (!smilestore.isKnownUser) {
  //     console.log('not known')
  //     smilestore.setKnown() // set new user and add document
  //   }
  // },
})

// captcha
timeline.pushSeqRoute({
  path: '/captcha',
  name: 'captcha',
  component: Captcha,
})

// instructions
timeline.pushSeqRoute({
  path: '/instructions',
  name: 'instructions',
  component: Instructions,
})

// main experiment
timeline.pushSeqRoute({
  path: '/exp',
  name: 'exp',
  component: Exp,
})

// debriefing form
timeline.pushSeqRoute({
  path: '/debrief',
  name: 'debrief',
  component: Debrief,
})

// thanks/submit page
timeline.pushSeqRoute({
  path: '/thanks',
  name: 'thanks',
  component: Thanks,
})

// this is a the special page that loads in the iframe on mturk.com
timeline.pushNonSeqRoute({
  path: '/mturk',
  name: 'mturk',
  component: MTurk,
  beforeEnter: (to) => {
    processQuery(to.query, 'mturk')
  },
})

// this is a special route with config/debugging information
timeline.pushNonSeqRoute({
  path: '/config',
  name: 'config',
  component: Config,
})

// 3. add navigation guards
//    currently these check if user is known
//    and if they are, they redirect to last route
function addGuards(r) {
  // r.beforeEach((to) => {
  //   const smilestore = useSmileStore()
  //   if (
  //     (to.name === 'recruit' && smilestore.config.mode === 'development') ||
  //     to.name === 'config' ||
  //     (smilestore.local.allowJumps && smilestore.config.mode === 'development')
  //   ) {
  //     return true // allow the requested route to load
  //   }
  //   // if not known and requesting welcome
  //   if (!smilestore.isKnownUser) {
  //     if (to.name === 'welcome' || to.name === 'consent') {
  //       // if requesting welcome, allow it
  //       return true // allow the requested route to load
  //     }
  //     console.log('screwed up', to.name)
  //     console.log('LAAAST route', smilestore.local.lastRoute)
  //     if (smilestore.local.lastRoute === 'consent') {
  //       return { name: 'consent', replace: true } // redirect to welcome
  //     }
  //     console.log('go to welcome')
  //     return { name: 'welcome', replace: true } // redirect to welcome
  //   }
  //   // otherwise is known so check if database connected
  //   // if not connect and load existing data
  //   // if yes just continue
  //   if (smilestore.isKnownUser && !smilestore.isDBConnected) {
  //     smilestore.loadData()
  //   }
  //   if (smilestore.local.lastRoute === to.name) {
  //     return true // allow the requested route to load, prevent infinite redirects
  //   }
  //   // go to where you left off
  //   return {
  //     name: smilestore.lastRoute, // to go where you leave off
  //     replace: true,
  //   }
  // })
  // not used but available
  // r.afterEach((to, from) => {
  //   const smilestore = useSmileStore()
  //   if (
  //     to.name === 'welcome' &&
  //     from.name === undefined &&
  //     smilestore.config.mode === 'development'
  //   ) {
  //     console.log('setting last route to ', to.name)
  //     smilestore.setLastRoute(to.name)
  //   }
  //   console.log('after each', to.name, from.name)
  //   if (smilestore.searchParams) {
  //     to.query = smilestore.searchParams
  //   }
  // })
}
timeline.buildProgress()
const { routes } = timeline
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
