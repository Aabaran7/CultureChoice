import { defineStore } from 'pinia'
import appconfig from '@/core/config'

export default defineStore('log', {
  state: () => ({
    history: [],
  }),
  actions: {
    log(message) {
      if (appconfig.mode === 'development') {
        // console.log(message)
      }
      const msg = {
        type: 'log',
        time: new Date().toLocaleTimeString('en-US', {timeZoneName: "short"}),
        message: message,
      }
      this.history.push(msg)
    },
    warn(message) {
      console.warn(message)
      const msg = {
        type: 'warn',
        time: new Date().toLocaleTimeString('en-US', {timeZoneName: "short"}),
        message: message,
      }
      this.history.push(msg)
    },
    error(message) {
      console.error(message)
      const msg = {
        type: 'error',
        time: new Date().toLocaleTimeString('en-US', {timeZoneName: "short"}),
        message: message,
      }
      this.history.push(msg)
    }
  },
})
