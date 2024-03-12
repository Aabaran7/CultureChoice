// create a default vue component using script setup // a default vue component using script setup
<script setup>
import { onMounted, watch, ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import DocsDropDown from '@/components/navbars/DocsDropDown.vue'
import RandomizationDropDown from '@/components/navbars/RandomizationDropDown.vue'
import ConfigDropDown from '@/components/navbars/ConfigDropDown.vue'
import TrialStepper from './TrialStepper.vue'

import useSmileStore from '@/stores/smiledata'
const smilestore = useSmileStore() // load the global store
const router = useRouter() // this is needed in composition API because this.$router not availabel
const route = useRoute()

const showpanels = reactive({
  docs: false,
  config: false,
  randomize: false,
  database: false,
  route: false,
})

function resetLocalState() {
  localStorage.removeItem(smilestore.config.local_storage_key) // delete the local store
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_id`)
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_set`)
  smilestore.$reset() // reset all the data even

  // go back to the landing page (don't use router because it won't refresh the page and thus won't reset the app)
  const url = window.location.href
  window.location.href = url.substring(0, url.lastIndexOf('#/'))
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
          <DocsDropDown></DocsDropDown>
        </div>
      </div>
    </div>

    <div class="navbar-end">
      <div class="navbar-item mainstate">
        <div class="buttons">
          <!-- reset button -->
          <button
            class="button is-warning is-light dev-bar-button has-tooltip-arrow has-tooltip-bottom"
            data-tooltip="Reset entire state"
            @click="resetLocalState()"
          >
            <FAIcon icon="fa-solid fa-arrow-rotate-left" /> &nbsp; Reset
          </button>

          <!-- home button -->
          <button
            class="button is-success is-light dev-bar-button has-tooltip-arrow has-tooltip-bottom"
            data-tooltip="Return to recruit page"
            @click="router.push('/')"
          >
            <FAIcon icon="fa-solid fa-house" /> &nbsp; Dev Home
          </button>

          <!-- config button -->
          <ConfigDropDown></ConfigDropDown>
          &nbsp;&nbsp;

          <!-- randomization button -->
          <RandomizationDropDown></RandomizationDropDown>

          <button
            class="button is-success is-light dev-bar-button has-tooltip-arrow has-tooltip-bottom ml-2"
            data-tooltip="View data"
            @click="router.push('/data')"
          >
            <FAIcon icon="fa-solid fa-database" /> &nbsp; Database &nbsp;&nbsp;
            <FAIcon icon="fa-solid fa-circle has-tooltip-bottom" class="reddot" data-tooltip="status" />
            &nbsp;&nbsp;
            <FAIcon icon="fa-solid fa-circle-dot" class="reddot" />
          </button>

          <button
            class="button is-success is-light dev-bar-button has-tooltip-arrow has-tooltip-bottom ml-0"
            data-tooltip="Click to toggle Consent"
            v-if="smilestore.isConsented"
            @click="smilestore.setUnconsented()"
          >
            <FAIcon icon="fa-solid fa-square-check has-tooltip-bottom" class="greendot" data-tooltip="status" />
          </button>
          <button
            v-else
            class="button is-danger is-light dev-bar-button has-tooltip-arrow has-tooltip-bottom ml-0"
            data-tooltip="Click to toggle Consent"
            @click="smilestore.setConsented()"
          >
            <FAIcon icon="fa-solid fa-square-xmark has-tooltip-bottom" class="reddot" data-tooltip="status" />
          </button>
        </div>
      </div>
      <!-- drop down-->
      <div class="navbar-item jumper">
        <div class="devmode">
          <TrialStepper :routeName="route.name"> </TrialStepper>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.dev-bar-button {
  font-size: 0.65rem;
  height: 2em;
}
</style>
<style scoped>
a:hover {
  color: #10dffa;
}

.jumper {
  padding-top: 4px;
  background-color: #79f2cc;
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

.mainstate {
  padding-top: 8px;
  background-color: rgb(63, 160, 149);
}
</style>
