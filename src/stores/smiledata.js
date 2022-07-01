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
    data: {
      trial_num: 0,
      service: 'prolific',
    },
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
