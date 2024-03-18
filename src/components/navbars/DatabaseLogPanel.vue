<script setup>
import SmileAPI from '@/core/composables/smileapi'
const api = SmileAPI()
</script>
<template>
  <!-- content of panel here -->
  <div class="contentpanel">
    <div class="scrollablelog">
      <div class="logentry" v-for="i in [...Array(50).keys()]">hi {{ i }}</div>
    </div>
  </div>
  <div class="searchbar"></div>
</template>

<style scoped>
.contentpanel {
  padding-left: 20px;
  margin-right: 0px;
  margin-bottom: 0px;
  height: 100%;
}
.scrollablelog {
  height: 100%;
  width: 100%;
  margin: 0px;
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
}
</style>
