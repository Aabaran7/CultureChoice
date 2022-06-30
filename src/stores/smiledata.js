import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import appconfig from '@/config'
// import createDoc from './firestore-db'

export default defineStore('smilestore', {
  // arrow function recommended for full type inference
  state: () => ({
    local: useStorage(appconfig.local_storage_key, {
      knownUser: false,
      lastRoute: 'home',
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
    setKnown() {
      this.local.knownUser = true
      // this.db.docRef = createDoc(appconfig)
    },
    setLastRoute(route) {
      if (route !== 'config') {
        this.local.lastRoute = route
      }
    },
    resetLocal() {
      this.local.knownUser = false
      this.local.lastRoute = 'home'
      // this.$reset()
    },
  },
})
