// plugins/smileconfig.js

import appconfig from '../config.js';

export default {
  install: (app, options) => {
    // plugin code goes here
    app.config.globalProperties.smileconfig = appconfig;
  },
};
