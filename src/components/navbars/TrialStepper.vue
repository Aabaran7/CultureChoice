<script setup>
import { watch, ref } from 'vue'
import useSmileStore from '@/stores/smiledata'
import { routes } from '@/router'
import { useRouter, useRoute } from 'vue-router'
import RouteGraph from './RouteGraph.vue'

const smilestore = useSmileStore() // load the global store
const props = defineProps(['routeName'])

const showpanel = ref(false)
const hoverRoute = ref('')
const router = useRouter() // this is needed in composition API because this.$router not availabel
const route = useRoute()
// watch route -- if route changes, update value of current query. This will get carried forward when you jump routes
const currentQuery = ref(route.query)
watch(route, async (newRoute, oldRoute) => {
  currentQuery.value = newRoute.query
})

function setHover(route) {
  console.log('got the hover event')
  hoverRoute.value = route
}

function setClicked(route) {
  console.log('got the click event')
  router.push({ name: route }) /// something something about passing queryparams
}
</script>

<template>
  <div class="columns is-right">
    <div class="column is-one-half">
      <div class="field has-addons">
        <p class="control">
          <button
            class="button is-small is-warning is-jump-bar has-tooltip-arrow has-tooltip-bottom"
            data-tooltip="Current trial counter">
            <span>{{ smilestore.getPageTracker(routeName) }}</span>
          </button>
        </p>
        <p class="control">
          <button
            class="button is-small is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
            v-on:click="smilestore.incrementPageTracker(routeName)"
            data-tooltip="Step trial forward">
            <span>
              <FAIcon icon="fa-solid fa-angle-up" />
            </span>
          </button>
        </p>
        <p class="control">
          <button
            class="button is-small is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
            v-on:click="smilestore.decrementPageTracker(routeName)"
            data-tooltip="Step trial back">
            <span>
              <FAIcon icon="fa-solid fa-angle-down" />
            </span>
          </button>
        </p>

        <p class="control" v-if="smilestore.hasAutofill">
          <button
            class="button is-small is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
            v-on:click="smilestore.autofill()" data-tooltip="Autofill Form">
            <span>
              <FAIcon icon="fa-solid fa-pen-to-square" />
            </span>
          </button>
        </p>
      </div>
    </div>
    <div class="column is-one-half">
      <div class="dropdown is-right is-hoverable"
        :class="{ 'is-active': showpanel }">
        <div class="dropdown-trigger routelabel"
          @click="$emit('toggleVisible')">
          <span>/{{ routeName }}</span>
        </div>
        <div class="dropdown-menu pt-2" id="dropdown-menu" role="menu">
          <div class="dropdown-content p*-3 is-left">
            <div class="pin" :class="{ 'pin-selected': showpanel }">
              <a @click="showpanel = !showpanel">
                <FAIcon icon=" fa-solid fa-thumbtack" />
              </a>
            </div>
            <div class="content">
              <h1 class="title is-6">Experiment Timeline</h1>
              <p class="has-text-left">
                When running in live mode, the experiment disallows arbitrary
                navigation between routes. If you enable
                the "force" option you can jump between routes even when it
                would be disallowed in live mode. The
                timeline graphs show how transitions between pages are arranged.
                Read more about the
                <a
                  href="https://smile.gureckislab.org/timeline.html">timeline</a>
                here. <br />
              </p>

              <hr class="dropdown-divider" />
              <div class="columns pt-0 mt-0">
                <div class="column pt-0 mt-0">
                  <RouteGraph :current-route="routeName"
                    :hover-route="hoverRoute" @hovered-on="setHover"
                    @clicked-on="setClicked"></RouteGraph>
                </div>
                <div class="column pt-0 mt-0">
                  <div class="field mt-4">
                    <input id="switchRoundedDefaultJump" type="checkbox"
                      name="switchRoundedDefaultJump"
                      class="switch is-rounded is-rtl is-small"
                      v-model="smilestore.local.allowJumps" />
                    <label for="switchRoundedDefaultJump">Force
                      navigation:</label>
                  </div>
                  <hr class="dropdown-divider" />
                  <br />
                  <template v-for="r in routes">
                    <!-- make a special link for web_referred, which has params -->
                    <router-link @mouseover="hoverRoute = r.name"
                      @mouseout="hoverRoute = ''"
                      class="dropdown-item routelink"
                      :class="{ hover: hoverRoute === r.name }"
                      v-if="r.name === 'welcome_referred'"
                      :to="{ name: r.name, params: { service: 'web' }, query: currentQuery }"
                      :key="r.path">
                      <div class="routelabel">
                        <span>/{{ r.name }}</span>
                      </div>
                    </router-link>
                    <!-- make a link for everything else -->

                    <router-link @mouseover="hoverRoute = r.name"
                      @mouseout="hoverRoute = ''"
                      class="dropdown-item routelink"
                      :class="{ route_selected: routeName === r.name, hover: hoverRoute === r.name }"
                      v-else :to="{ name: r.name, query: currentQuery }"
                      :key="r.name">
                      <div class="routelabel">
                        <span>/{{ r.name }}</span>
                      </div>
                    </router-link>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
