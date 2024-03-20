<script setup>
import { computed } from 'vue'
import SmileAPI from '@/core/composables/smileapi'
const api = SmileAPI()

import useLog from '@/core/stores/log'
const log = useLog()

const height_pct = computed(() => `${api.dev.data_bar_height - 32}px`)
</script>
<template>
  <!-- content of panel here -->
  <div class="contentpanel">
    <div class="scrollablelog">
      <aside class="menu">
        <ul class="menu-list">
          <li v-for="msg in log.history">
            <a
              ><FAIcon icon=" fa-solid fa-angle-right" /> {{ msg.time }} <b>{{ msg.message }}</b></a
            >
          </li>
        </ul>
      </aside>
    </div>
  </div>
  <div class="searchbar"></div>
</template>

<style scoped>
.columnheader {
  background: #f4f4f4;
  color: #858484;
  padding: 5px;
  font-size: 0.8em;
  margin-bottom: 10px;
  margin-top: 0px;
}
.contentpanel {
  padding-left: 0px;
  margin: 0px;
  margin-right: 0px;
  margin-bottom: 0px;
  height: 100%;
}
.scrollablelog {
  height: v-bind(height_pct);
  width: 100%;
  margin: 0px;
  margin-top: 0px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
}
.menu-list li {
  font-size: 0.8em;
  font-family: monospace;
  border-bottom: 1px solid #f2f2f2;
}
</style>
