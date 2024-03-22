import { defineStore } from 'pinia'
import appconfig from '@/core/config'

function getLogTrace() {
  // some browsers use 'at ', some use '@'
  const lines = new Error().stack.split('\n').filter(line => line.includes('at ') || line.includes('@'))
  if (lines.length < 4) {
    return '(could not parse trace)'
  }
  // strip leading 'http://localhost:xxx/' and '?t=xxx' query param, if present
  const regex = /(?:at\s|@)(?:.*?\s\()?(http:\/\/localhost:\d+\/)?(?<filePath>.+?)(?:\?.*?)?(?::(?<lineNumber>\d+):(?<columnNumber>\d+))\)?/
  const match = regex.exec(lines[3])
  if (match) {
    return `${match.groups.filePath} (line ${match.groups.lineNumber}, column ${match.groups.columnNumber})`
  } else {
    return '(could not parse trace)'
  }
}

export default defineStore('log', {
  state: () => ({
    history: [],
  }),
  actions: {
    log(message) {
      const msg = {
        type: 'log',
        time: new Date().toLocaleTimeString('en-US', {timeZoneName: "short"}),
        message: message,
        trace: getLogTrace(),
      }
      this.history.push(msg)
    },
    warn(message) {
      console.warn(message)
      const msg = {
        type: 'warn',
        time: new Date().toLocaleTimeString('en-US', {timeZoneName: "short"}),
        message: message,
        trace: getLogTrace(),
      }
      this.history.push(msg)
    },
    error(message) {
      console.error(message)
      const msg = {
        type: 'error',
        time: new Date().toLocaleTimeString('en-US', {timeZoneName: "short"}),
        message: message,
        trace: getLogTrace(),
      }
      this.history.push(msg)
    }
  },
})
