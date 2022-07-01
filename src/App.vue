<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { inject } from 'vue'
import DeveloperNavBar from '@/components/pages/organisms/DeveloperNavBar.vue';
//import StatusBar from '@/components/pages/organisms/StatusBar.vue';
//<StatusBar></StatusBar>
const smileconfig = inject('smileconfig')

</script>

<template>
  <DeveloperNavBar v-if="smileconfig.mode=='development'"></DeveloperNavBar>
  
  <div class="router">
    <router-view></router-view>
  </div>
</template>

<style>
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
