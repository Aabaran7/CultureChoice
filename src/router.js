// import { ref } from 'vue'
import '@/core/seed'
import seedrandom from 'seedrandom'
import { createRouter, createWebHashHistory } from 'vue-router'
import { v4 as uuidv4 } from 'uuid'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import appconfig from '@/core/config'
import { processQuery, getQueryParams } from '@/utils'
import Timeline from '@/core/timeline'
import RandomSubTimeline from '@/core/subtimeline'

// 1. Import route components
import RecruitmentChooser from '@/components/recruitment/RecruitmentChooserPage.vue'
import PresentationModeHomePage from '@/components/presentation_mode/PresentationModeHomePage.vue'
import MTurk from '@/components/recruitment/MTurkRecruitPage.vue'
import Advertisement from '@/components/recruitment/AdvertisementPage.vue'
import Consent from '@/components/consent/ConsentPage.vue'
import DemographicSurvey from '@/components/surveys/DemographicSurveyPage.vue'
import Captcha from '@/components/captcha/CaptchaPage.vue'
import Instructions from '@/components/instructions/InstructionsPage.vue'
import Exp from '@/components/tasks/ExpPage.vue'
import Task1 from '@/components/tasks/Task1Page.vue'
import Task2 from '@/components/tasks/Task2Page.vue'
import StroopExp from '@/components/tasks/StroopExp.vue'
import Debrief from '@/components/debrief/DebriefPage.vue'
import Thanks from '@/components/thanks/ThanksPage.vue'
import Withdraw from '@/components/errors_withdraw/WithdrawPage.vue'
import WindowSizer from '@/components/screen_adjust/WindowSizerPage.vue'
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
  timeline.pushRoute({
    path: '/',
    name: 'recruit',
    component: RecruitmentChooser,
    meta: { allowDirectEntry: true },
  })
} else if (appconfig.mode === 'presentation') {
  timeline.pushRoute({
    path: '/',
    name: 'presentation_home',
    component: PresentationModeHomePage,
    meta: { allowDirectEntry: true },
  })
} else {
  // auto refer to the anonymous welcome page
  timeline.pushRoute({
    path: '/',
    name: 'landing',
    redirect: {
      name: 'welcome_anonymous',
    },
    meta: { allowDirectEntry: true },
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
  meta: {
    next: 'consent',
    allowDirectEntry: true,
  }, // override what is next
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

// windowsizer
timeline.pushSeqRoute({
  path: '/windowsizer',
  name: 'windowsizer',
  component: WindowSizer,
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

// create subtimeline for randomization
const randTimeline = new RandomSubTimeline()

randTimeline.pushRoute({
  path: '/task1',
  name: 'task1',
  component: Task1,
})

randTimeline.pushRoute({
  path: '/task2',
  name: 'task2',
  component: Task2,
})

// if you want fixed orders based on conditions, uncomment meta line
// commented out, this will shuffle the routes at random
timeline.pushRandomizedTimeline({
  name: randTimeline,
  // meta: { label: "taskOrder", orders: {AFirst: ["task1", "task2"], BFirst: ["task2", "task1"]} }
})

// stroop exp
timeline.pushSeqRoute({
  path: '/stroop',
  name: 'stroop',
  component: StroopExp,
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

// this is a special page that is for a withdraw
timeline.pushRoute({
  path: '/withdraw',
  name: 'withdraw',
  component: Withdraw,
})

// this is a the special page that loads in the iframe on mturk.com
timeline.pushRoute({
  path: '/mturk',
  name: 'mturk',
  component: MTurk,
  beforeEnter: (to) => {
    processQuery(to.query, 'mturk')
  },
})

// 3. add navigation guards
//    currently these check if user is known
//    and if they are, they redirect to last route
function addGuards(r) {
  r.beforeEach((to, from) => {
    // Set queries to be combination of from queries and to queries (TO overwrites FROM if there is one with the same key)
    // Also add queries that come before the URL
    const newQueries = {
      ...from.query,
      ...to.query,
      ...getQueryParams(),
    }
    to.query = newQueries
    // console.log('query params', to.query)
    // console.log('loading', to.name)
    // console.log('from', from.name)
    // console.log('allowDirectEntry', to.meta.allowDirectEntry)

    const smilestore = useSmileStore()
    // if the database isn't connected and they're a known user, reload their data
    if (smilestore.isKnownUser && !smilestore.isDBConnected) {
      smilestore.loadData()
    }

    //if withdrew
    // this is leading to infinite redirects.
    // if (smilestore.data.withdraw && !smilestore.local.allowJumps) {
    //   console.log("withdraw so can't go anywhere")
    //   return {
    //     name: 'withdraw',
    //     replace: true,
    //   }
    // }

    // if you're going to an always-allowed route, allow it
    if (to.meta.allowDirectEntry) {
      smilestore.setLastRoute(to.name)
      smilestore.recordRoute(to.name)
      return true
    }

    // if you're trying to go to the welcome screen and you're not a known user, allow it
    if (to.name === 'welcome_anonymous' && from.name === undefined && !smilestore.isKnownUser) {
      smilestore.setLastRoute(to.name)
      smilestore.recordRoute(to.name)
      return true
    }

    // if you're trying to go to the next route
    if (from.meta !== undefined && from.meta.next === to.name) {
      smilestore.setLastRoute(to.name)
      smilestore.recordRoute(to.name)
      return true
    }

    // if you're in jumping mode
    // or you're in presentation mode allow the new route
    if (
      (smilestore.config.mode === 'development' && smilestore.local.allowJumps) ||
      smilestore.config.mode === 'presentation'
    ) {
      console.warn(
        'WARNING: allowing direct, out-of-order navigation to',
        to.name,
        //to.meta.allowDirectEntry,
        '.  This is allowed in development/presentation mode but not in production.'
      )
      smilestore.setLastRoute(to.name)
      smilestore.recordRoute(to.name)
      return true
    }

    // if the next route is a subtimeline and you're trying to go to a subtimeline route, allow it
    // this is necessary because from.meta.next won't immediately get the subroute as next when the subtimeline is randomized
    if (
      from.meta !== undefined &&
      from.meta.next !== undefined &&
      from.meta.next.type === 'randomized_sub_timeline' &&
      to.meta.subroute
    ) {
      smilestore.setLastRoute(to.name)
      smilestore.recordRoute(to.name)
      return true
    }
    // if you're trying to go to the same route you're already on, allow it
    if (smilestore.lastRoute === to.name) {
      return true
    }
    // if you're a known user (and not trying to go to the next or same route), send back to most recent route
    if (smilestore.isKnownUser) {
      return {
        name: smilestore.lastRoute,
        replace: true,
      }
    }
    if (!smilestore.isKnownUser && to.name === 'landing') {
      return {
        name: 'welcome_anonymous',
        replace: true,
      }
    }
    if (to.name !== 'welcome_anonymous') {
      // otherwise (for an unknown user who's not trying to go to next/same route), just send to welcome anonymous screen
      return {
        name: 'welcome_anonymous',
        replace: true,
      }
    }
    return true // is this right? why is the default to allow the navigation?
  })
}
timeline.build()

const { routes } = timeline

// 4. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
export const router = createRouter({
  history: createWebHashHistory(), // We are using the hash history for now/simplicity
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})
addGuards(router) // add the guards defined above

// add additional guard to set global seed before
router.beforeResolve((to) => {
  const smilestore = useSmileStore()
  if (smilestore.local.seedActive) {
    const seedID = smilestore.getSeedID
    const seed = `${seedID}-${to.name}`
    seedrandom(seed, { global: true })
  } else {
    // if inactive, generate a random string then re-seed
    const newseed = uuidv4()
    seedrandom(newseed, {
      global: true,
    })
  }
})

// they are defined in a function like this for the testing harness
export { routes, addGuards }

export default router
