import { useRoute, useRouter } from 'vue-router'
import useSmileStore from '@/core/stores/smiledata'
import useTimelineStepper from '@/core/composables/timelinestepper'
// import seeded randomization function for this component/route
// random seeding is unique to each component/route
import { shuffle } from '@/core/randomization'

// import the trial stepper functionality which advances linearly through
// a set of trials
import { useTrialStepper } from '@/core/composables/trialstepper'

export default function useSmileAPI() {
  const { stepNextRoute, stepPrevRoute } = useTimelineStepper()
  const route = useRoute()
  const router = useRouter()
  const smilestore = useSmileStore()
  const api = {
    config: smilestore.config,
    data: smilestore.data,
    local: smilestore.local,
    global: smilestore.global,
    route: route,
    router: router,
    stepNextRoute: stepNextRoute,
    stepPrevRoute: stepPrevRoute,
    shuffle: shuffle,
    useTrialStepper: useTrialStepper,
    isKnownUser: smilestore.isKnownUser,
    urls: smilestore.global.urls,
    setKnown: () => {
      smilestore.setKnown()
    },
    setDone: () => {
      smilestore.setDone()
    },
    setConsented: () => {
      smilestore.setConsented()
    },
    setWithdraw: (forminfo) => {
      smilestore.setWithdraw(forminfo)
    },
    saveDemographicForm: (data) => {
      smilestore.saveDemographicForm(data)
    },
    setPageAutofill: (autofill) => {
      console.log('setting autofil')
      if (smilestore.config.mode === 'development') smilestore.setPageAutofill(autofill)
    },
    setCompletionCode: (code) => {
      smilestore.setCompletionCode(code)
    },
    getRecruitmentService: () => {
      return smilestore.data.recruitment_service
    },
    currentRouteName: () => {
      return route.name
    },
    getCurrentTrial: () => {
      return smilestore.getPage[route.name]
    },
    getBrowserFingerprint: () => {
      return smilestore.getBrowserFingerprint()
    },
    recordWindowEvent: (type, event_data = null) => {
      smilestore.recordWindowEvent(type, event_data)
    },
    incrementTrial: () => {
      smilestore.incrementPageTracker(route.name)
    },
    decrementTrial: () => {
      smilestore.decrementPageTracker(route.name)
    },
    resetTrial: () => {
      smilestore.resetPageTracker(route.name)
    },
    saveData: (force) => {
      smilestore.saveData(force)
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
