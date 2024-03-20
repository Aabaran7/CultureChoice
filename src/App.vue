<script setup>
import { onMounted, watch, ref } from 'vue'
// load sub-components used in this compomnents
import DeveloperNavBar from '@/components/navbars/DeveloperNavBar.vue'
import StatusBar from '@/components/navbars/StatusBar.vue'
import PresentationNavBar from '@/components/navbars/PresentationNavBar.vue'
import ProgressBar from './components/navbars/ProgressBar.vue'
import DevDataBar from './components/navbars/DevDataBar.vue'

// import and initalize smile API
import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()

import useLog from '@/core/stores/log'
const log = useLog()

import useSmileStore from '@/core/stores/smiledata'
const smilestore = useSmileStore() // load the global store

var snapshot = { ...smilestore.$state.data }

smilestore.$subscribe((mutation, newstate) => {
  //console.log('something changed', mutation, newstate)
  // // import { MutationType } from 'pinia'
  // mutation.type // 'direct' | 'patch object' | 'patch function'
  // // same as cartStore.$id
  // mutation.storeId // 'cart'
  // // only available with mutation.type === 'patch object'
  // mutation.payload // patch object passed to cartStore.$patch()
  Object.keys(newstate.data).forEach((key) => {
    //console.log(newstate.data[key])
    if (snapshot[key] !== newstate.data[key]) {
      //console.log(`Value changed for ${key}: from ${snapshot[key]} to ${newstate.data[key]}`)
      log.log(`Value changed for ${key}: from ${snapshot[key]} to ${newstate.data[key]}`)
      smilestore.global.db_changes = true
    }
  })

  snapshot = { ...newstate.data }
  // // persist the whole state to the local storage whenever it changes
  // localStorage.setItem('cart', JSON.stringify(state))
})

// monitor events on the main window
onMounted(() => {
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
  <DeveloperNavBar v-if="api.config.mode == 'development'"> </DeveloperNavBar>
  <PresentationNavBar v-if="api.config.mode == 'presentation'"> </PresentationNavBar>
  <StatusBar
    v-if="
      api.currentRouteName() !== 'data' && api.currentRouteName() !== 'recruit' && api.config.mode != 'presentation'
    "
  ></StatusBar>

  <div class="router">
    <router-view></router-view>
    <!-- the router loads here -->
  </div>

  <ProgressBar
    v-if="
      api.currentRouteName() !== 'config' &&
      api.currentRouteName() !== 'recruit' &&
      api.config.show_progress_bar == 'true'
    "
  >
  </ProgressBar>
  <Transition name="v-slide">
    <DevDataBar v-if="api.dev.show_data_bar"></DevDataBar>
  </Transition>
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
  height: 100vh;
  background-color: v-bind(api.global.page_bg_color);
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
