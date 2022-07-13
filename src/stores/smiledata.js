import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import appconfig from '@/config'

import { createDoc, updateDoc, loadDoc } from './firestore-db'

export default defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage(appconfig.local_storage_key, {
      // syncs with local storage
      knownUser: false,
      lastRoute: 'home',
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
    },
    data: {
      // syncs with firestore
      trial_num: 0, // not being updated correctly
      consented: false,
      service: 'prolific', // fake
      demographic_form: {}, // empty
    },
    config: appconfig,
  }),

  getters: {
    isKnownUser: (state) => state.local.knownUser,
    lastRoute: (state) => state.local.lastRoute,
    isDBConnected: (state) => state.global.db_connected,
  },

  actions: {
    setDBConnected() {
      this.global.db_connected = true
    },
    setConsented() {
      this.data.consented = true
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
      // this.local.lastRoute = 'home'
      // this.local.allowJumps = false
      // this.global.db_connected = false
      this.$reset()
    },
  },
})
