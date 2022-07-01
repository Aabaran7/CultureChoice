import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// import { initializeApp } from 'firebase/app'
// import { getFirestore, collection, addDoc } from 'firebase/firestore'
import appconfig from '@/config'

import { createDoc } from './firestore-db'

export default defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage(appconfig.local_storage_key, {
      knownUser: false,
      lastRoute: 'home',
      allowJumps: false,
    }),
    db: {
      docRef: null,
    },
    data: {
      trial_num: 0,
    },
  }),

  getters: {
    isKnownUser: (state) => state.local.knownUser,
    lastRoute: (state) => state.local.lastRoute,
  },

  actions: {
    async setKnown() {
      this.local.knownUser = true
      const docRef = createDoc(appconfig)
    },
    setLastRoute(route) {
      if (route !== 'config') {
        this.local.lastRoute = route
      }
    },
    resetLocal() {
      this.local.knownUser = false
      this.local.lastRoute = 'home'
      this.local.allowJumps = false
      // this.$reset()
    },
  },
})
