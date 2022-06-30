<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { inject } from 'vue'

const smileconfig = inject('smileconfig')

</script>

<template>
  <nav v-if="smileconfig.mode=='development'" class="navbar">
        <div class="devmode">DEVELOPER MODE</div>
  </nav>
  <div class="router">
    <router-view></router-view>
  </div>
</template>

<style>
:root {
    --vp-font-family-base: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    --vp-font-family-mono: Menlo, Monaco, Consolas, "Courier New", monospace
}

.navbar {
  font-size: 12px;
  background: rgb(63, 160, 149);
  color: #fff;
  height: 5px;
  padding: 0px;
  margin: 0px;
  min-height: 30px;
}

.devmode {
  padding-top: 8px;
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
