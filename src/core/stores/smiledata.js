import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import appconfig from '@/core/config'

import {
  createDoc,
  updateSubjectDataRecord,
  updateExperimentCounter,
  balancedAssignConditions,
  loadDoc,
  fsnow,
} from './firestore-db'

function initLastRoute(mode) {
  if (mode === 'development') {
    return 'recruit'
  }
  if (mode === 'presentation') {
    return 'presentation_home'
  }
  return 'landing'
}

function initAllowJumps(mode) {
  return mode === 'development' || mode === 'presentation'
}

export default defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage(
      appconfig.local_storage_key,
      {
        // syncs with local storage
        knownUser: false,
        lastRoute: initLastRoute(appconfig.mode),
        allowJumps: initAllowJumps(appconfig.mode),
        docRef: null,
        partNum: null,
        completionCode: null,
        totalWrites: 0,
        lastWrite: null,
        seedActive: true, // do you want to use a random seed based on the participant's ID?
        seedID: '',
        seedSet: false,
        pageTracker: {},
        possibleConditions: { taskOrder: ['AFirst', 'BFirst'], instructions: ['version1', 'version2', 'version3'] },
      },
      localStorage,
      { mergeDefaults: true }
    ),
    global: {
      // ephemeral state, resets on browser refresh
      progress: 0,
      page_bg_color: '#fff',
      page_text_color: '#000',
      status_bar_bg_color: '#fff',
      status_bar_text_color: '#000',
      db_connected: false,
      db_changes: true,
      search_params: null,
      urls: {
        prolific: '?PROLIFIC_PID=XXXX&STUDY_ID=XXXX&SESSION_ID=XXXXX#/welcome/prolific/',
        cloudresearch:
          '#/welcome/cloudresearch/?assignmentId=123RVWYBAZW00EXAMPLE456RVWYBAZW00EXAMPLE&hitId=123RVWYBAZW00EXAMPLE&turkSubmitTo=https://www.mturk.com/&workerId=AZ3456EXAMPLE',
        mturk:
          '#/mturk/?assignmentId=123RVWYBAZW00EXAMPLE456RVWYBAZW00EXAMPLE&hitId=123RVWYBAZW00EXAMPLE&turkSubmitTo=https://www.mturk.com/&workerId=AZ3456EXAMPLE',
        citizensci:
          '#/welcome/citizensci/?CITIZEN_ID=XXXXX&CITIZEN_STUDY_ID=123RVWYBAZW00EXAMPLE&CITIZEN_SESSION_ID=AZ3456EXAMPLE',
        web: '#/welcome',
      },
    },
    dev: useStorage(
      appconfig.dev_local_storage_key,
      {
        // syncs with local storage
        page_provides_autofill: null,
        show_data_bar: false,
        data_bar_height: 300,
        data_bar_tab: 'database',
        data_path: null,
        config_panel: { type: 'local', visible: false, x: -280, y: 0 },
        state_var_panel: { type: 'local', visible: false, x: -150, y: 0 },
        randomization_panel: { visible: false, x: -130, y: 0 },
        route_panel: { visible: false, x: -490, y: 1 },
      },
      localStorage,
      { mergeDefaults: true }
    ),
    data: {
      // syncs with firestore
      trial_num: 0, // not being updated correctly
      consented: false,
      done: false,
      starttime: null, // time consented
      endtime: null, // time finished or withdrew
      recruitment_service: 'web', // fake
      recruitment_info: {}, // empty
      browser_fingerprint: {}, // empty
      browser_data: [], // empty
      demographic_form: {}, // empty
      withdraw: false, // false
      withdraw_data: {}, // empty
      route_order: [],
      conditions: {},
      smile_config: appconfig, //  adding config info to firebase document
      study_data: [],
    },
    config: appconfig,
  }),

  getters: {
    isKnownUser: (state) => state.local.knownUser,
    isConsented: (state) => state.data.consented,
    isDone: (state) => state.data.done,
    lastRoute: (state) => state.local.lastRoute,
    isDBConnected: (state) => state.global.db_connected,
    hasAutofill: (state) => state.dev.page_provides_autofill,
    searchParams: (state) => state.global.search_params,
    recruitmentService: (state) => state.data.recruitment_service,
    isSeedSet: (state) => state.local.seedSet,
    getSeedID: (state) => state.local.seedID,
    getLocal: (state) => state.local,
    getPage: (state) => state.local.pageTracker,
    getPossibleConditions: (state) => state.local.possibleConditions,
    getConditions: (state) => state.data.conditions,
  },

  actions: {
    setDBConnected() {
      this.global.db_connected = true
    },
    setSearchParams(search_params) {
      this.global.search_params = search_params
    },
    setConsented() {
      this.data.consented = true
      this.data.starttime = fsnow()
    },
    setUnconsented() {
      this.data.consented = false
    },
    setWithdraw(forminfo) {
      this.data.withdraw = true
      this.data.withdraw_data = forminfo
      this.data.endtime = fsnow()
    },
    setDone() {
      this.data.done = true
      this.data.endtime = fsnow()
    },
    setCompletionCode(code) {
      this.local.completionCode = code
    },
    setSeedID(seed) {
      this.local.seedID = seed
      this.local.seedSet = true
    },
    registerPageTracker(page) {
      if (this.local.pageTracker[page] === undefined) {
        console.log('registering', page, this.local.pageTracker[page])
        this.local.pageTracker[page] = 0
      }
    },
    getPageTracker(page) {
      return this.local.pageTracker[page]
    },
    incrementPageTracker(page) {
      if (this.local.pageTracker[page] !== undefined) {
        this.local.pageTracker[page] += 1
        return this.local.pageTracker[page]
      } else {
        console.error('SMILESTORE: page tracker not initialized for page', page)
      }
    },
    decrementPageTracker(page) {
      if (this.local.pageTracker[page] !== undefined) {
        this.local.pageTracker[page] -= 1
        if (this.local.pageTracker[page] < 0) {
          this.local.pageTracker[page] = 0
        }
        return this.local.pageTracker[page]
      } else {
        console.error('SMILESTORE: page tracker not initialized for page', page)
      }
    },
    resetPageTracker(page) {
      if (this.local.pageTracker[page]) {
        this.local.pageTracker[page] = 0
      }
    },
    recordWindowEvent(type, event_data = null) {
      if (event_data) {
        this.data.browser_data.push({
          event_type: type,
          timestamp: fsnow(),
          event_data,
        })
      } else {
        this.data.browser_data.push({
          event_type: type,
          timestamp: fsnow(),
        })
      }
    },
    getBrowserFingerprint() {
      // this is not "real" browser fingerprinting, but it's close enough for our purposes
      // it just finds things like browser version, OS, and IP address of user
      // which can be helpful for debugging purposes
      let ip = 'unknown'
      // Make a request for a user with a given ID
      axios
        .get('https://api.ipify.org/?format=json')
        .then((response) => {
          // handle success
          console.log('ip address', response.data)
          // check if ip field exists
          if (response.data.ip) {
            ip = response.data.ip
          }
        })
        .catch((error) => {
          // handle error
          console.log(error)
        })
        .finally(() => {
          // always executed
          const { language } = window.navigator
          const { webdriver } = window.navigator
          const { userAgent } = window.navigator
          this.setFingerPrint(ip, userAgent, language, webdriver)
        })
    },
    setFingerPrint(ip, userAgent, language, webdriver) {
      this.data.browser_fingerprint = {
        ip,
        userAgent,
        language,
        webdriver,
      }
      console.log(this.data.browser_fingerprint)
    },
    setPageAutofill(fn) {
      this.dev.page_provides_autofill = fn
    },
    removePageAutofill() {
      this.dev.page_provides_autofill = null
    },
    setRecruitmentService(service, info) {
      this.data.recruitment_service = service
      this.data.recruitment_info = info
    },
    autofill() {
      if (this.dev.page_provides_autofill) {
        this.dev.page_provides_autofill()
      }
    },
    saveTrialData(data) {
      this.data.study_data.push(data)
    },
    saveDemographicForm(data) {
      this.data.demographic_form = data
    },
    setCondition(name, cond) {
      this.data.conditions[name] = cond
    },
    async setKnown() {
      // TODD: this need to have an exception handler wrapping around it
      // because things go wrong
      this.local.knownUser = true
      this.local.partNum = await updateExperimentCounter('participants')
      this.local.docRef = await createDoc(this.data, this.local.seedID, this.local.partNum)
      // if possible conditions are not empty, assign conditions
      if (this.local.possibleConditions) {
        this.data.conditions = await balancedAssignConditions(this.local.possibleConditions, this.data.conditions)
      }
      if (this.local.docRef) {
        this.setDBConnected()
        // force a data save so conditions get added to the data right away
        this.saveData(true)
      } else {
        console.error('SMILESTORE: could not create document in firebase')
      }
      return this.data.conditions
    },
    async loadData() {
      let data
      if (this.local.docRef) {
        data = await loadDoc(this.local.docRef)
      }
      if (data) {
        this.data = data
        this.setDBConnected()
      }
    },
    setLastRoute(route) {
      this.local.lastRoute = route
      // if (route !== 'config') {
      //   this.local.lastRoute = route
      // }
    },
    recordRoute(route) {
      this.data.route_order.push(route)
    },
    async saveData(force = false) {
      if (this.isDBConnected) {
        if (!force && this.local.totalWrites >= appconfig.max_writes) {
          console.error(
            'SMILESTORE: max writes reached to firebase.  Data NOT saved.  Call saveData() less numerously to avoid problems/cost issues.'
          )
          return
        }

        if (!force && this.local.lastWrite && Date.now() - this.local.lastWrite < appconfig.min_write_interval) {
          console.error(
            'SMILESTORE: write interval too short for firebase.  Data NOT saved. Call saveData() less frequently to avoid problems/cost issues.'
          )
          console.error('SMILESTORE: interval was', appconfig.min_write_interval)
          // console.error(Date.now() - this.local.lastWrite)
          return
        }
        await updateSubjectDataRecord(this.data, this.local.docRef)
        this.local.totalWrites += 1
        this.local.lastWrite = Date.now()
        //this.global.snapshot = { ...smilestore.$state.data }
        this.global.db_changes = false // reset the changes flag

        console.log('Request to firebase successful')
      } else {
        console.error("SMILESTORE: can't save data, not connected to firebase")
      }
    },
    resetLocal() {
      // this.local.knownUser = false
      // this.local.lastRoute = 'welcome'
      // this.local.allowJumps = false
      // this.global.db_connected = false
      this.$reset()
    },
  },
})
