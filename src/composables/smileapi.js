import { useRoute, useRouter } from 'vue-router'
import useSmileStore from '@/stores/smiledata'
import useTimelineStepper from '@/composables/timelinestepper'
// import seeded randomization function for this component/route
// random seeding is unique to each component/route
import { shuffle } from '@/randomization'

// import the trial stepper functionality which advances linearly through
// a set of trials
import { useTrialStepper } from '@/composables/trialstepper'

export default function useSmileAPI() {
  const { stepNextRoute, stepPrevRoute } = useTimelineStepper()
  const route = useRoute()
  const router = useRouter()
  const smilestore = useSmileStore()
  const api = {
    store: smilestore,
    route: route,
    router: router,
    stepNextRoute: stepNextRoute,
    stepPrevRoute: stepPrevRoute,
    shuffle: shuffle,
    useTrialStepper: useTrialStepper,
    currentRouteName: () => {
      return route.name
    },
    getCurrentTrial: () => {
      return smilestore.getPage[route.name]
    },
    incrementTrial: () => {
      smilestore.incrementPageTracker(route.name)
    },
    saveTrialData: (data) => {
      smilestore.saveTrialData(data)
      console.log('data ', smilestore.data.study_data)
    },
  }

  // on startup set the page to not autofill by default
  if (smilestore.config.mode == 'development') smilestore.removePageAutofill() // should put there everywhere on init

  return api
}
