<script setup>
import { useMouse } from '@vueuse/core'
import { ref, computed } from 'vue'
import DatabaseInfoPanel from '@/components/navbars/DatabaseInfoPanel.vue'
import DatabaseLogPanel from '@/components/navbars/DatabaseLogPanel.vue'
import DatabaseBrowsePanel from '@/components/navbars/DatabaseBrowsePanel.vue'

import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()
const mousedown = ref(false)

const { x, y } = useMouse()

const height_pct = computed(() => `${api.dev.data_bar_height}px`)

function down() {
  mousedown.value = true
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
}
function up() {
  mousedown.value = false
}
function move() {
  if (mousedown.value == true) {
    api.dev.data_bar_height = Math.min(window.innerHeight - y.value + 20, window.innerHeight) // small adjustment to where you probably click
  }
}
</script>

<template>
  <nav class="navbar devdatabar is-fixed-bottom">
    <aside class="menu">
      <ul class="menu-list">
        <li :class="{ active: api.dev.data_bar_tab == 'database' }">
          <a @click="api.dev.data_bar_tab = 'database'"><FAIcon icon="fa-solid fa-database icon" /> Database Info</a>
        </li>
        <li :class="{ active: api.dev.data_bar_tab == 'browse' }">
          <a @click="api.dev.data_bar_tab = 'browse'">
            <FAIcon icon="fa-solid fa-magnifying-glass icon" /> Data Explorer
          </a>
        </li>
        <li :class="{ active: api.dev.data_bar_tab == 'log' }">
          <a @click="api.dev.data_bar_tab = 'log'"> <FAIcon icon="fa-solid fa-book icon" /> Transaction Log </a>
        </li>
      </ul>
    </aside>

    <section class="section secpanel">
      <nav class="navbar logpanel" role="navigation" aria-label="data navigation">
        <div id="navbardatabase" class="navbar-menu" @mousedown="down()">
          <div class="navbar-start">
            <a class="navbar-item" v-if="api.dev.data_bar_tab == 'database'"
              ><FAIcon icon="fa-solid fa-database icon" />&nbsp;&nbsp;<b>Database Info</b></a
            >
            <a class="navbar-item" v-if="api.dev.data_bar_tab == 'browse'"
              ><FAIcon icon="fa-solid fa-magnifying-glass icon" />&nbsp;&nbsp;<b>Data Explorer</b></a
            >
            <a class="navbar-item" v-if="api.dev.data_bar_tab == 'log'"
              ><FAIcon icon="fa-solid fa-book icon" />&nbsp;&nbsp;<b>Transaction Log</b></a
            >
          </div>

          <div class="navbar-end">
            <div class="navbar-item closebutton">
              <a class="navbar-item" @click="api.dev.show_data_bar = !api.dev.show_data_bar">
                <FAIcon icon="fa-solid fa-circle-xmark icon" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <!-- content of panel here -->
      <DatabaseInfoPanel v-if="api.dev.data_bar_tab == 'database'"></DatabaseInfoPanel>
      <DatabaseBrowsePanel v-if="api.dev.data_bar_tab == 'browse'"></DatabaseBrowsePanel>
      <DatabaseLogPanel v-if="api.dev.data_bar_tab == 'log'"></DatabaseLogPanel>
    </section>
  </nav>
</template>

<style scoped>
.menu-label {
  background: #78bfe0;
  color: #fff;
}
.secpanel {
  width: 100%;
  padding: 0;
  margin: 0;
  text-align: left;
  height: 100%;
}
.logpanel {
  width: 100%;
  font-size: 12px;
  background: #e6f5fc;
  color: #fff;
  height: 30px;
  min-height: 30px;
  padding: 0px;
  margin: 0px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  border-top: none;
}
.closebutton {
  padding-right: 2px;
}
.labeltext {
  color: #000;
  width: 20%;
  font-weight: 700;
}

.icon {
  color: #f9d403;
}

.navbar-end {
  width: 100%;
}

.menu {
  background: #e6f5fc;
  width: 200px;
  padding-left: 5px;
  border-right: 1px solid #b9b9b9;
}

.menu-label {
  font-size: 0.8em;
  text-align: left;
  padding-top: 10px;
  padding-left: 3px;
}

.menu-list {
  padding-top: 6px;
}
.menu-list li {
  font-size: 0.75em;
  text-align: left;
  padding-right: 3px;
}

.menu-list a:hover {
  background: #c1e7ef;
  color: #000;
}

.active a {
  background-color: rgb(40, 118, 176);
  color: #fff;
}
.active a:hover {
  background-color: rgb(40, 118, 176);
  color: #fff;
}

.databar {
  padding: 0px;
  margin: 0px;
}

.container {
  width: 100%;
  padding: 0px;
  margin: 0px;
}
.columns {
  border: 1px solid;
  width: 100%;
}
.column {
  border: 1px solid;
  padding: 0px;
  margin: 0px;
  text-align: left;
}

.devdatabar {
  border-top: 1px solid #b9b9b9;
  background: #fff;
  color: #000;
  height: v-bind(height_pct);
  padding: 0px;
  margin: 0px;
  margin-bottom: 0px;
}
</style>
