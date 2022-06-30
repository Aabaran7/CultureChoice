<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { inject } from 'vue'

const smileconfig = inject('smileconfig')

</script>

<template>
  <div v-if="smileconfig.mode=='development'" class="devmode">DEVELOPER MODE</div>
  <div v-else class="devmode">PRODUCTION/LIVE MODE</div>
  <br>
  <router-view></router-view>
</template>

<style>
:root {
    --vp-font-family-base: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    --vp-font-family-mono: Menlo, Monaco, Consolas, "Courier New", monospace
}

.devmode {
  font-size: 12px;
}

#app {
  font-family: var(--vp-font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
