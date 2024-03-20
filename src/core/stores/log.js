import { defineStore } from 'pinia'
import appconfig from '@/core/config'

export default defineStore('log', {
  state: () => ({
    history: [],
  }),
  actions: {
    log(message) {
      const msg = {
        time: new Date().toISOString(),
        message: message,
      }
      this.history.push(msg)
      if (appconfig.mode === 'development') {
        console.log(msg)
      }
    },
  },
})
