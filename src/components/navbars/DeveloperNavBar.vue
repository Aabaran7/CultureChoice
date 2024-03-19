// create a default vue component using script setup // a default vue component using script setup
<script setup>
import { onMounted, watch, ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import DocsDropDown from '@/components/navbars/DocsDropDown.vue'
import RandomizationDropDown from '@/components/navbars/RandomizationDropDown.vue'
import ConfigDropDown from '@/components/navbars/ConfigDropDown.vue'
import StateVarsDropDown from '@/components/navbars/StateVarsDropDown.vue'
import TrialStepper from './TrialStepper.vue'

import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()

const panel = reactive({ visible: false, x: 0, y: 0 })

function resetLocalState() {
  localStorage.removeItem(api.config.local_storage_key) // delete the local store
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_id`)
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_set`)
  api.resetStore() // reset all the data even

  // go back to the landing page (don't use router because it won't refresh the page and thus won't reset the app)
  const url = window.location.href
  window.location.href = url.substring(0, url.lastIndexOf('#/'))
}

function resetDevState() {
  localStorage.removeItem(api.config.dev_local_storage_key) // delete the local store
  location.reload()
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <div class="devmode-title">
        <div
          class="has-tooltip-arrow has-tooltip-bottom"
          @click="resetDevState()"
          data-tooltip="Reset developer interface"
        >
          <FAIcon icon="fa-solid fa-arrow-rotate-left" />&nbsp;<b>DEVELOPER MODE</b>
        </div>
      </div>
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
            <FAIcon icon="fa-solid fa-arrow-rotate-left" />
          </button>

          <!-- config button -->
          <ConfigDropDown></ConfigDropDown>

          <button
            class="button is-success is-light dev-bar-button has-tooltip-arrow has-tooltip-bottom ml-2"
            data-tooltip="Toggle data panel | Firebase connected | Changes in data"
            v-if="api.global.db_connected"
            @click="api.dev.show_data_bar = !api.dev.show_data_bar"
          >
            <FAIcon icon="fa-solid fa-database" /> &nbsp;&nbsp;|&nbsp;&nbsp;<FAIcon
              icon="fa-solid fa-circle"
              class="connected"
              :class="{ connected: api.global.db_connected == true }"
            />
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <FAIcon
              icon="fa-solid
            fa-circle-dot"
              class="warning"
              :class="{ disconnected: api.global.db_changes }"
            />
          </button>
          <button
            class="button is-success is-light dev-bar-button has-tooltip-arrow has-tooltip-bottom ml-2"
            data-tooltip="Toggle data panel | Firebase not connected | Changes in data"
            @click="api.dev.show_data_bar = !api.dev.show_data_bar"
            v-else
          >
            <FAIcon icon="fa-solid fa-database" /> &nbsp;&nbsp;|&nbsp;&nbsp;<FAIcon
              icon="fa-solid fa-circle"
              class="disconnected"
            />
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <FAIcon
              icon="fa-solid
            fa-circle-dot"
              class="warning"
              :class="{ disconnected: api.global.db_changes }"
            />
          </button>

          <!-- randomization button -->
          <RandomizationDropDown></RandomizationDropDown>
          &nbsp;&nbsp;

          <!-- state variable buttons -->
          <StateVarsDropDown></StateVarsDropDown>
          &nbsp;&nbsp;
        </div>
      </div>
      <!-- drop down-->
      <div class="navbar-item jumper">
        <div class="devmode">
          <TrialStepper :routeName="api.currentRouteName()"> </TrialStepper>
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
.disconnected {
  color: red;
}
.connected {
  color: rgb(13, 206, 13);
}
.warning {
  color: #d5d808;
}
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
