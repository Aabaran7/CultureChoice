import { createApp } from 'vue'
import App from './App.vue'
import smileconfig from './plugins/smileconfig'

var app = createApp(App)
app.use(smileconfig, {}) // register plugin.  this provides a variable smileconfig in all components
app.mount('#app')
