// create a default vue component using script setup // a default vue component using script setup
<script setup>
import { onMounted, watch, ref, reactive, computed } from 'vue'
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

const database_tooltip = computed(() => {
  var msg = 'Toggle data panel | '
  if (api.global.db_connected == true) {
    msg += 'Database connected | '
  } else {
    msg += 'Database not connected | '
  }
  if (api.global.db_changes == true) {
    msg += 'Unsynced data'
  } else {
    msg += 'Data in sync'
  }
  return msg
})
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
            class="button is-success is-light dev-bar-button has-tooltip-arrow has-tooltip-bottom"
            :data-tooltip="database_tooltip"
            @click="api.dev.show_data_bar = !api.dev.show_data_bar"
          >
            <FAIcon
              icon="fa-solid fa-database"
              class="disconnected"
              :class="{ connected: api.global.db_connected == true }"
            />
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <template v-if="!api.global.db_connected">
              <FAIcon icon="fa-solid fa-rotate" class="has-text-grey" />
            </template>
            <template v-else-if="api.global.db_changes">
              <FAIcon icon="fa-solid fa-rotate" class="outofsync" />
            </template>
            <template v-else>
              <FAIcon icon="fa-solid fa-rotate" class="insync" />
            </template>
          </button>

          <!-- randomization button -->
          <RandomizationDropDown></RandomizationDropDown>

          <!-- state variable buttons -->
          <StateVarsDropDown></StateVarsDropDown>
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
.outofsync {
  color: rgb(245, 206, 14);
}
.insync {
  color: rgb(13, 206, 13);
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
