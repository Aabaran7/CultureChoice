<script setup>
import { inject} from 'vue'  // required to inject smileconfig

// load sub-components used in this compomnents
import DeveloperNavBar from '@/components/organisms/DeveloperNavBar.vue';
import StatusBar from '@/components/organisms/StatusBar.vue';
import ProgressBar from './components/molecules/ProgressBar.vue';

// imports the global config object
const smileconfig = inject('smileconfig') 
</script>

<template>
  <DeveloperNavBar v-if="smileconfig.mode=='development'"></DeveloperNavBar>
  <StatusBar v-if="$route.name!=='config'"></StatusBar>
  <ProgressBar v-if="$route.name!=='config'"></ProgressBar>
  <div class="router">
    <router-view></router-view> <!-- the router loads here -->
  </div>
  
</template>

<style>

/* global fonts **/
:root {
    --vp-font-family-base: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    --vp-font-family-mono: Menlo, Monaco, Consolas, "Courier New", monospace
}

.router {
  padding-top:0px;
}

#app {
  font-family: var(--vp-font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
