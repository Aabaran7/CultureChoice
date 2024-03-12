<script setup>
import { onMounted, watch, ref, reactive } from 'vue'
import { useMouse } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'

import TrialStepper from './TrialStepper.vue'
import useSmileStore from '@/stores/smiledata'

import appconfig from '@/config'

const smilestore = useSmileStore() // load the global store
const { x, y } = useMouse({ touch: false }) // tracks mouse reactively
const router = useRouter() // this is needed in composition API because this.$router not availabel
const route = useRoute()
const seed = ref(smilestore.getSeedID)

// watch route -- if route changes, update value of current query. This will get carried forward when you jump routes
const currentQuery = ref(route.query)
watch(route, async (newRoute, oldRoute) => {
  currentQuery.value = newRoute.query
})

// easter egg to jump to config page (press 2 with mouse in top right of screen)
onMounted(() => {
  window.addEventListener('keyup', (ev) => {
    if (x.value < 10 && y.value < 50 && ev.key === '2') {
      router.push('/config') // jump to the config page
    }
    if (x.value < 10 && y.value < 50 && ev.key === '1') {
      router.push('/') // jump to the start page (or get redirected)
    }
    if (x.value < 10 && y.value < 50 && ev.key === 'a') {
      smilestore.autofill()
    }
  })
})

function resetLocalState() {
  // this is repeated on config and maybe should be a utility function
  localStorage.removeItem(smilestore.config.local_storage_key) // delete the local store
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_id`)
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_set`)
  smilestore.$reset() // reset all the data even
  window.location = '/' // this will refresh the page rather than just load the route
  // router.push('/')
}

// display in the toolbar the selected conditions
const conditions = reactive(smilestore.getConditions)

// when condition is set in the store, update the toolbar conditions
watch(
  () => smilestore.data.conditions,
  async (newConds) => {
    // for each key in newConds, update that entry in conditions
    Object.keys(newConds).forEach((key) => {
      conditions[key] = newConds[key]
    })
  }
)

// when a condition is changed in the toolbar, update the store
function changeCond(key, cond) {
  smilestore.setCondition(key, cond)
}

function refresh() {
  resetLocalState() // we really only want to call this on click...
  window.location = `/#/?SEED=${seed.value}`
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <div class="devmode-title">DEVELOPER MODE</div>
    </div>

    <div id="mainbar" class="navbar-menu">
      <div class="navbar-start">
        <div class="devmode">

          &nbsp;
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item mainstate">
          <div class="buttons">
            <button
              class="button is-warning is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
              data-tooltip="Reset entire state" @click="resetLocalState()">
              <FAIcon icon="fa-solid fa-arrow-rotate-left" /> &nbsp; Reset
            </button>
            <button
              class="button is-success is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
              data-tooltip="Return to recruit page" @click="router.push('/')">
              <FAIcon icon="fa-solid fa-house" /> &nbsp; Dev Home
            </button>
            <button
              class="button is-success is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom"
              data-tooltip="View config" @click="router.push('/config')">
              <FAIcon icon="fa-solid fa-gear" /> &nbsp; Config
            </button>



            <button
              class="button is-success is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom ml-2"
              data-tooltip="View data" @click="router.push('/data')">
              <FAIcon icon="fa-solid fa-database" /> &nbsp; Database
              &nbsp;&nbsp;
              <FAIcon icon="fa-solid fa-circle has-tooltip-bottom"
                class="reddot" data-tooltip="status" />
              &nbsp;&nbsp;
              <FAIcon icon="fa-solid fa-circle-dot" class="reddot" />
            </button>

            <button
              class="button is-success is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom ml-0"
              data-tooltip="Click to toggle Consent"
              v-if="smilestore.isConsented"
              @click="smilestore.setUnconsented()">
              <FAIcon icon="fa-solid fa-square-check has-tooltip-bottom"
                class="greendot" data-tooltip="status" />
            </button>
            <button v-else
              class="button is-danger is-light is-jump-bar has-tooltip-arrow has-tooltip-bottom ml-0"
              data-tooltip="Click to toggle Consent"
              @click="smilestore.setConsented()">
              <FAIcon icon="fa-solid fa-square-xmark has-tooltip-bottom"
                class="reddot" data-tooltip="status" />
            </button>

          </div>
        </div>

        <!-- drop down-->
        <div class="navbar-item jumper">
          <div class="devmode">
            <TrialStepper :routeName="route.name"></TrialStepper>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.reddot {
  color: #d88686;
}

.greendot {
  color: #53a853;
}

.dropdown-content {
  margin-top: 0px;
}

.randomization {
  width: 350px;
  padding: 15px;
  text-align: left;
}

.randomization a {
  color: #0b8a9b;
}

.routelabel {
  font-weight: 600;
  font-family: 'Courier New', Courier, monospace;
}

.is-jump-bar {
  font-size: 0.65rem;
  height: 2em;
}

.mainstate {
  padding-top: 8px;
  background-color: rgb(63, 160, 149);
}

.datastate {
  padding-top: 3px;
  background-color: rgb(228, 233, 178);
}

.jumper {
  padding-top: 3px;
  background-color: #79f2cc;
}

.jumper-button {
  width: 100px;
}

a {
  color: #fff;
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

a:hover {
  color: #10dffa;
}

.iconcolor {
  color: #10dffa;
}

.navbar {
  font-size: 13px;
  background: rgb(63, 160, 149);
  color: #fff;
  height: 0px;
  padding: 0px;
  padding-left: 10px;
  margin: 0px;
  min-height: 32px;
  text-align: center;
}

.devmode-title {
  padding-top: 8px;
  font-weight: 500;
  padding-left: 10px;
}

.devmode {
  padding-top: 8px;
  font-weight: 400;
  padding-left: 10px;
}

.dropdown-menu {
  min-width: 80px;
}

.route_selected {
  background-color: #bbbbbb;
  color: #fff;
  font-weight: 500;
}
</style>
