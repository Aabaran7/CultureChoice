<script setup>
import { useRouter, useRoute } from 'vue-router'
import useSmileStore from '@/core/stores/smiledata'

import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()
</script>

<template>
  <nav class="navbar is-fixed-bottom">
    <div class="container is-fluid pl-6 pr-6">
      <div class="columns">
        <div class="column is-3">Side tabs</div>
        <div class="column is-9">Show me the data</div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.labeltext {
  color: #000;
  width: 20%;
  font-weight: 700;
}

.navbar {
  font-size: 13px;
  border-top: 2px solid #b9b9b9;
  background: #f2f2f2;
  color: #000;
  height: 25%;
  padding: 0px;
  padding-top: 20px;
  padding-left: 0px;
  padding-bottom: 50px;
  margin: 0px;
  min-height: 10%;
  text-align: center;
}
</style>
