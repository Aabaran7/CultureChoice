import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import appconfig from '@/config'

import { createDoc, updateDoc, loadDoc, fsnow } from './firestore-db'

export default defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage(appconfig.local_storage_key, {
      // syncs with local storage
      knownUser: false,
      lastRoute: appconfig.mode === 'development' ? 'recruit' : 'welcome',
      allowJumps: false,
      docRef: null,
    }),
    global: {
      // ephemeral state, resets on browser refresh
      progress: 0,
      page_bg_color: '#fff',
      page_text_color: '#000',
      status_bar_bg_color: '#fff',
      status_bar_text_color: '#000',
      db_connected: false,
      search_params: null,
    },
    dev: {
      // ephemeral state, utilized by developer mode functions
      page_provides_autofill: null,
    },
    data: {
      // syncs with firestore
      trial_num: 0, // not being updated correctly
      consented: false,
      service: 'unknown', // fake
      recruitment_info: {}, // empty
      browser_data: [], // empty
      demographic_form: {}, // empty
    },
    config: appconfig,
  }),

  getters: {
    isKnownUser: (state) => state.local.knownUser,
    isConsented: (state) => state.data.consented,
    lastRoute: (state) => state.local.lastRoute,
    isDBConnected: (state) => state.global.db_connected,
    hasAutofill: (state) => state.dev.page_provides_autofill,
    searchParams: (state) => state.global.search_params,
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
    setPageAutofill(fn) {
      this.dev.page_provides_autofill = fn
    },
    removePageAutofill() {
      this.dev.page_provides_autofill = null
    },
    setProlific(prolific_id, study_id, session_id) {
      this.data.service = 'prolific'
      this.data.recruitment_info = {
        prolific_id,
        study_id,
        session_id,
      }
    },
    setMechanicalTurk(worker_id, hit_id, assignment_id) {
      this.data.service = 'mechanicalturk'
      this.data.recruitment_info = {
        worker_id,
        hit_id,
        assignment_id,
      }
    },
    setCitizen(citizen_id, task_id, assign_id) {
      this.data.service = 'citizen'
      this.data.recruitment_info = {
        citizen_id,
        task_id,
        assign_id,
      }
    },
    autofill() {
      if (this.dev.page_provides_autofill) {
        this.dev.page_provides_autofill()
      }
    },
    saveDemographicForm(data) {
      this.data.demographic_form = data
    },
    async setKnown() {
      this.local.knownUser = true
      this.local.docRef = await createDoc(this.data)
      if (this.local.docRef) {
        this.setDBConnected()
      }
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
    async saveData() {
      if (this.isDBConnected) {
        updateDoc(this.data, this.local.docRef)
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
