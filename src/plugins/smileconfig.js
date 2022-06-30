/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
// plugins/smileconfig.js

import appconfig from '@/config'

export default {
  install: (app, options) => {
    // plugin code goes here
    // app.config.globalProperties.smileconfig = appconfig

    app.provide('smileconfig', appconfig)
  },
}
