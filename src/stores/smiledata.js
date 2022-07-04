import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// import { initializeApp } from 'firebase/app'
// import { getFirestore, collection, addDoc } from 'firebase/firestore'
import appconfig from '@/config'

import { createDoc, updateDoc } from './firestore-db'

export default defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage(appconfig.local_storage_key, {
      knownUser: false,
      lastRoute: 'home',
      allowJumps: false,
      docRef: null,
    }),
    global: {
      progress: 0,
      page_bg_color: '#000',
      page_text_color: '#000',
      status_bar_bg_color: '#fff',
      status_bar_text_color: '#000',
    },
    data: {
      trial_num: 0,
      consented: false,
      working: true,
      service: 'prolific',
    },
    config: appconfig,
  }),

  getters: {
    isKnownUser: (state) => state.local.knownUser,
    lastRoute: (state) => state.local.lastRoute,
  },

  actions: {
    async setKnown() {
      this.local.knownUser = true
      this.local.docRef = await createDoc(this.data, appconfig)
    },
    setLastRoute(route) {
      if (route !== 'config') {
        this.local.lastRoute = route
      }
    },
    async saveData() {
      await updateDoc(this.data, this.local.docRef, appconfig)
    },
    resetLocal() {
      this.local.knownUser = false
      this.local.lastRoute = 'home'
      this.local.allowJumps = false
      // this.$reset()
    },
  },
})
