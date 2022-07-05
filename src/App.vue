<script setup>
import { ref } from 'vue'
import useSmileStore from '@/stores/smiledata'

// load sub-components used in this compomnents
import DeveloperNavBar from '@/components/organisms/DeveloperNavBar.vue';
import StatusBar from '@/components/organisms/StatusBar.vue';
import ProgressBar from './components/molecules/ProgressBar.vue';

// imports the global config object
const smilestore = useSmileStore()
const bgcolor = ref('green')
</script>

<template>
  <DeveloperNavBar v-if="smilestore.config.mode=='development'"></DeveloperNavBar>
  <StatusBar v-if="$route.name!=='config'"></StatusBar>
  <div class="router">
    <router-view></router-view> <!-- the router loads here -->
  </div>
  <ProgressBar v-if="$route.name!=='config'"></ProgressBar>
</template>

<style>
/* global fonts **/
:root {
    --vp-font-family-base: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    --vp-font-family-mono: Menlo, Monaco, Consolas, "Courier New", monospace;
    /* fontkit overrides */
    --fk-color-primary: #48c78e;
}

.router {
  height: 100vh;
  background-color: v-bind(smilestore.global.page_bg_color);
}

#app {
  font-family: var(--vp-font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
