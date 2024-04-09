<script setup>
//import RouteGraph from '@/components/navbars/RouteGraph.vue'
import { watch, ref } from 'vue'

import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()
const props = defineProps(['routeName'])

import useSmileStore from '@/core/stores/smiledata'
import { routes } from '@/core/router'
import { useRouter, useRoute } from 'vue-router'
const smilestore = useSmileStore() // load the global store

const hoverRoute = ref('')
const router = useRouter() // this is needed in composition API because this.$router not availabel
const route = useRoute()

// watch route -- if route changes, update value of current query. This will get carried forward when you jump routes
const currentQuery = ref(route.query)
watch(route, async (newRoute, oldRoute) => {
  currentQuery.value = newRoute.query
})

function toggle_and_reset() {
  api.dev.route_panel.visible = !api.dev.route_panel.visible
  if (api.dev.route_panel.visible == false) {
    api.dev.route_panel.x = -300
    api.dev.route_panel.y = -3
  }
}

function onDragCallback(x, y) {
  api.dev.config_panel.x = x
  api.dev.config_panel.y = y
}

function setHover(route) {
  hoverRoute.value = route
}

function setClicked(route) {
  console.log('got the click event')
  router.push({ name: route }) /// something something about passing queryparams
}
</script>
<template>
  <vue-draggable-resizable
    :x="api.dev.route_panel.x"
    :y="api.dev.route_panel.y"
    :draggable="api.dev.route_panel.visible"
    :resizable="false"
    :onDrag="onDragCallback"
  >
    <div class="dropdown-content p*-3 is-left">
      <div class="pin" :class="{ 'pin-selected': api.dev.route_panel.visible }">
        <a @click="toggle_and_reset()">
          <FAIcon icon=" fa-solid fa-thumbtack" />
        </a>
      </div>
      <div class="content">
        <div class="columns pt-0 mt-0">
          <div class="column is-9 pt-0 mt-0">
            <h1 class="title is-6">Experiment Timeline</h1>
            <p class="has-text-left">
              If you enable the "force" option you can jump between routes even when it would be disallowed in live
              mode. The timeline graphs show how transitions between pages are arranged. Read more about the
              <a href="https://smile.gureckislab.org/timeline.html">timeline</a>
              here. <br />
            </p>
            <div class="field mt-4 has-text-right">
              <input
                id="switchRoundedDefaultJump"
                type="checkbox"
                name="switchRoundedDefaultJump"
                class="switch is-rounded is-rtl is-small"
                v-model="smilestore.local.allowJumps"
              />
              <label for="switchRoundedDefaultJump"><b>Force navigation:</b></label>
            </div>
            <!--<RouteGraph
              :current-route="routeName"
              :hover-route="hoverRoute"
              @hovered-on="setHover"
              @clicked-on="setClicked"
            ></RouteGraph>-->
          </div>
          <div class="column is-3 pt-0 mt-0">
            <template v-for="r in routes">
              <!-- make a special link for web_referred, which has params -->
              <router-link
                @mouseover="hoverRoute = r.name"
                @mouseout="hoverRoute = ''"
                class="dropdown-item routelink"
                :class="{ hover: hoverRoute === r.name }"
                v-if="r.name === 'welcome_referred'"
                :to="{ name: r.name, params: { service: 'web' }, query: currentQuery }"
                :key="r.path"
              >
                <div class="routelabel">
                  <span class="is-size-7">/{{ r.name }}</span>
                </div>
              </router-link>
              <!-- make a link for everything else -->

              <router-link
                @mouseover="hoverRoute = r.name"
                @mouseout="hoverRoute = ''"
                class="dropdown-item routelink"
                :class="{ route_selected: routeName === r.name, hover: hoverRoute === r.name }"
                v-else
                :to="{ name: r.name, query: currentQuery }"
                :key="r.name"
              >
                <div class="routelabel">
                  <span class="is-size-7">/{{ r.name }}</span>
                </div>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </vue-draggable-resizable>
</template>

<style scoped>
.dropdown-content {
  padding: 0;
  padding-top: 8px;
  margin: 0;
  width: 700px;
  text-align: left;
}
.content {
  padding: 15px;
  text-align: left;
}
.routelink {
  font-family: monospace;
}

.pin {
  float: right;
  margin: 0;
  padding-right: 15px;
  color: #fff;
}

.pin a {
  color: #ccc;
}

.pin-selected a {
  color: #42b983;
}

.datapanel {
  padding: 15px;
  text-align: left;
  width: 500px;
}

.dropdown-content b {
  color: #000;
  font-size: 13px;
}
.dropdown-divider {
  margin: 0;
}

.dropdown-item {
  color: #000;
  font-size: 13px;
  padding: 8px;
  margin: 0px;
  text-align: left;
}
.route_selected {
  background-color: #bbbbbb;
  color: #fff;
  font-weight: 500;
}

a {
  color: #42b983;
}

.tabs {
  margin-bottom: 0px;
}

.routelabel {
  font-weight: 800;
  font-family: 'Courier New', Courier, monospace;
}

.config {
  text-align: left;
  margin-left: 20px;
  font-family: monospace;
  font-size: 0.9em;
  font-weight: 500;
}

.config a {
  color: #0b8a9b;
}

.config b {
  color: #639aa6;
}

.code {
  background: rgb(251, 251, 251);
  margin: auto;
  margin-top: 0px;
  margin-right: 25px;
  padding: 10px;
  word-wrap: break-word;
}

.code p {
  text-align: left;
  font-size: 0.9em;
}
</style>
