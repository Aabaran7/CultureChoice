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
  <Transition>
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
</style>
