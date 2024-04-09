<script setup>
import { watch, ref, reactive } from 'vue'
import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()

import useSmileStore from '@/core/stores/smiledata'
import { routes } from '@/core/router'
import { useRouter, useRoute } from 'vue-router'
import RouteGraph from './RouteGraph.vue'

const smilestore = useSmileStore() // load the global store
const props = defineProps(['routeName'])

const hoverRoute = ref('')
const router = useRouter() // this is needed in composition API because this.$router not availabel
const route = useRoute()
// watch route -- if route changes, update value of current query. This will get carried forward when you jump routes
const currentQuery = ref(route.query)
watch(route, async (newRoute, oldRoute) => {
  currentQuery.value = newRoute.query
})

//const panel = reactive({ visible: false, x: -490, y: 1 })

function toggle_and_reset() {
  api.dev.route_panel.visible = !api.dev.route_panel.visible
  if (api.dev.route_panel.visible == false) {
    api.dev.route_panel.x = -490
    api.dev.route_panel.y = 1
  }
}
function onDragCallback(x, y) {
  api.dev.route_panel.x = x
  api.dev.route_panel.y = y
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
  <div class="columns is-right fixedcol">
    <div class="column is-one-half">
      <div class="dropdown is-right is-hoverable" :class="{ 'is-active': api.dev.route_panel.visible }">
        <div class="dropdown-trigger routelabel has-text-left" @click="$emit('toggleVisible')">
          <button class="button is-small">/{{ routeName }}</button>
        </div>
        <div class="dropdown-menu pt-2" id="dropdown-menu" role="menu">
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
                      If you enable the "force" option you can jump between routes even when it would be disallowed in
                      live mode. The timeline graphs show how transitions between pages are arranged. Read more about
                      the
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
                    <RouteGraph
                      :current-route="routeName"
                      :hover-route="hoverRoute"
                      @hovered-on="setHover"
                      @clicked-on="setClicked"
                    ></RouteGraph>
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
        </div>
      </div>
    </div>

    <div class="column is-one">
      <div class="field has-addons">
        <p class="control">
          <button
            class="button is-small is-warning is-jump-bar has-tooltip-arrow has-tooltip-bottom"
            data-tooltip="Current trial counter"
          >
            <span>{{ smilestore.getPageTracker(routeName) }}</span>
          </button>
        </p>
        <p class="control" v-if="smilestore.hasAutofill">
          <button
            class="button is-small is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
            v-on:click="smilestore.autofill()"
            data-tooltip="Autofill Form"
          >
            <span>
              <FAIcon icon="fa-solid fa-pen-to-square" />
            </span>
          </button>
        </p>
      </div>
      <div class="field has-addons">
        <p class="control">
          <button
            class="button is-small is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
            v-on:click="api.stepPrevRoute()"
            data-tooltip="Step page back"
          >
            <span>
              <FAIcon icon="fa-solid fa-angles-left" />
            </span>
          </button>
        </p>
        <p class="control">
          <button
            class="button is-small is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
            v-on:click="smilestore.decrementPageTracker(routeName)"
            data-tooltip="Step trial back"
          >
            <span>
              <FAIcon icon="fa-solid fa-angle-left" />
            </span>
          </button>
        </p>
        <p class="control">
          <button
            class="button is-small is-light is-jump-bar has-tooltip-arrow has-tooltip-left"
            v-on:click="smilestore.incrementPageTracker(routeName)"
            data-tooltip="Step trial forward"
          >
            <span>
              <FAIcon icon="fa-solid fa-angle-right" />
            </span>
          </button>
        </p>
        <p class="control">
          <button
            class="button is-small is-light is-jump-bar has-tooltip-arrow has-tooltip-left"
            v-on:click="api.stepNextRoute()"
            data-tooltip="Step page forward"
          >
            <span>
              <FAIcon icon="fa-solid fa-angles-right" />
            </span>
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fixedcol {
  min-width: 380px;
}
.dropdown-content {
  padding: 0;
  padding-top: 8px;
  margin: 0;
  width: 700px;
  text-align: left;
}

.pin {
  float: right;
  margin: 0;
  padding-top: 10px;
  padding-right: 15px;
  color: #fff;
}

.pin a {
  color: #ccc;
}

.pin-selected a {
  color: #42b983;
}

.content {
  padding: 15px;
  text-align: left;
}

.forcebox {
  padding-right: 40px;
}

.is-jump-bar {
  font-size: 0.65rem;
  width: 0.5em;
  height: 2em;
}

.hover {
  background-color: whitesmoke;
}

.routelabel {
  font-weight: 800;
  font-family: 'Courier New', Courier, monospace;
}

.dropdown-content {
  border-radius: 0;
  padding-top: 0;
  padding-bottom: 0;
  color: #000;
}

.routelink {
  font-family: monospace;
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
</style>
