<script setup>
/* 
   WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING 
   WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING 
   WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING 
   WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING 
   WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING 
   WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING WARNING 

   WARNING WHEN MAKING CHANGES TO THIS FILE 

   ANY LINE THAT CONTAINS THE TEXT "SMILE_DEV_ONLY" IS A DEVELOPER-ONLY LINE OF CODE
   AND IS REMOVED PRIOR TO DEPLOYMENT BY THE deploy.yml and deploy-hash.yml SCRIPT
   LOCATED IN THE .github/workflows FOLDER.

   ANY LINE THAT CONTAINS THE TEXT "SMILE_PRESENTATION_ONLY" IS A PRESENTATION-ONLY LINE OF CODE
   THIS IS REMOVED PRIOR TO DEPLOYMENT FOR ANY BRANCH OTHER THAN 'presentation'

   THIS MIGHT NOT BE IDEAL BUT IS A CHEAP TEMPLATE OPTION
   VITE MIGHT HAVE SOME PLUGIN TO DO THIS BETTER IN FUTURE

*/
import { onMounted, computed, ref } from 'vue'

// load sub-components used in this compomnents
import DeveloperNavBar from '@/components/navbars/DeveloperNavBar.vue' // SMILE_DEV_ONLY
import DevDataBar from '@/components/navbars/DevDataBar.vue'// SMILE_DEV_ONLY
import PresentationNavBar from '@/components/navbars/PresentationNavBar.vue'  // SMILE_PRESENTATION_ONLY

import StatusBar from '@/components/navbars/StatusBar.vue'
import ProgressBar from '@/components/navbars/ProgressBar.vue'

// import and initalize smile API
import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()

import useLog from '@/core/stores/log'
const log = useLog()

import useSmileStore from '@/core/stores/smiledata'
const smilestore = useSmileStore() // load the global store

var snapshot = { ...smilestore.$state.data } // SMILE_DEV_ONLY
smilestore.$subscribe((mutation, newstate) => { // SMILE_DEV_ONLY
  Object.keys(newstate.data).forEach((key) => { // SMILE_DEV_ONLY
    if (snapshot[key] !== newstate.data[key]) { // SMILE_DEV_ONLY
      log.log(`smilestore.data value changed for ${key}: from ${snapshot[key]} to ${newstate.data[key]}`) // SMILE_DEV_ONLY
      smilestore.global.db_changes = true // SMILE_DEV_ONLY
    } // SMILE_DEV_ONLY
  }) // SMILE_DEV_ONLY
  snapshot = { ...newstate.data } // SMILE_DEV_ONLY
}) // SMILE_DEV_ONLY

const total_height = computed(() => { // SMILE_DEV_ONLY
  if (!api.dev.show_data_bar) { // SMILE_DEV_ONLY
    return '100vh' // SMILE_DEV_ONLY
  } else { // SMILE_DEV_ONLY
    var pct = (window.innerHeight + api.dev.data_bar_height)/window.innerHeight*100 // SMILE_DEV_ONLY
    return `${pct}vh` // SMILE_DEV_ONLY
  } // SMILE_DEV_ONLY
}) // SMILE_DEV_ONLY


onMounted(() => {
  log.log('App.vue initialized')
  window.addEventListener('resize', (event) => {
    api.recordWindowEvent('resize', { width: window.innerWidth, height: window.innerHeight })
  })

  window.addEventListener('focus', (event) => {
    api.recordWindowEvent('focus')
  })

  window.addEventListener('blur', (event) => {
    api.recordWindowEvent('blur')
  })

  api.getBrowserFingerprint()
})
</script>

<template>
  <DeveloperNavBar v-if="api.config.mode == 'development'"> </DeveloperNavBar> <!-- // SMILE_DEV_ONLY -->
  <PresentationNavBar v-if="api.config.mode == 'presentation'"> </PresentationNavBar> <!-- // SMILE_PRESENTATION_ONLY -->
  <StatusBar
    v-if="
      api.currentRouteName() !== 'data' && api.currentRouteName() !== 'recruit' && api.config.mode != 'presentation'
    "
  ></StatusBar>
  <!-- the router loads here -->
  <div class="router">
    <router-view></router-view>
  </div>
  <ProgressBar
    v-if="
      api.currentRouteName() !== 'config' &&
      api.currentRouteName() !== 'recruit' &&
      api.config.show_progress_bar == 'true'
    "
  >
  </ProgressBar>
  <Transition name="v-slide"> <!-- // SMILE_DEV_ONLY -->
    <DevDataBar v-if="api.dev.show_data_bar"></DevDataBar> <!-- // SMILE_DEV_ONLY -->
  </Transition> <!-- // SMILE_DEV_ONLY -->
</template>

<style>
/* global fonts **/
:root {
  --vp-font-family-base: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --vp-font-family-mono: Menlo, Monaco, Consolas, 'Courier New', monospace;
  /* fontkit overrides */
  --fk-color-primary: #48c78e;
}

.router {
  height: '100vh';
  height: v-bind(total_height); /* // SMILE_DEV_ONLY */
  background-color: var(--page-bg-color);
}

#app {
  font-family: var(--vp-font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.v-slide-enter-active,
.v-slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.v-slide-enter-from,
.v-slide-leave-to {
  overflow: hidden;
  max-height: 0;
  height: 0;
}
.v-slide-enter-to,
.v-slide-leave-from {
  overflow: hidden;
  max-height: 100%;
  height: auto;
}
</style>
