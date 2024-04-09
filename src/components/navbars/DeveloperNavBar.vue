<script setup>
import { onMounted, watch, ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import CircleProgress from './CircleProgress.vue'
import DocsDropDown from '@/components/navbars/DocsDropDown.vue'
import RandomizationDropDown from '@/components/navbars/RandomizationDropDown.vue'
import ConfigDropDown from '@/components/navbars/ConfigDropDown.vue'
import StateVarsDropDown from '@/components/navbars/StateVarsDropDown.vue'
import Stepper from '@/components/navbars/Stepper.vue'
import RouteInfoDropDrop from '@/components/navbars/RouteInfoDropDown.vue'
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
    msg += 'Unsynced data '
  } else {
    msg += 'Data in sync '
  }
  if (api.global.db_connected == true) {
    msg += '| '
    msg += Math.round((api.local.approx_data_size / 1048576) * 1000) / 1000 + '% data used'
  }
  return msg
})
</script>

<template>
  <nav class="devbar">
    <div class="devbar-brand">
      <div
        class="devbar-title has-tooltip-arrow has-tooltip-bottom"
        @click="resetDevState()"
        data-tooltip="Reset developer interface"
      >
        <div class="devbar-fulltitle"><FAIcon icon="fa-solid fa-arrow-rotate-left" />&nbsp;<b>DEVELOPER MODE</b></div>
        <div class="devbar-subtitle"><FAIcon icon="fa-solid fa-arrow-rotate-left" />&nbsp;<b>DEV MODE</b></div>
      </div>
    </div>

    <div class="devbar-menu">
      <div class="devbar-start">
        <div class="devmode">
          <DocsDropDown></DocsDropDown>
        </div>
      </div>

      <div class="devbar-end">
        <div class="devbar-item devbar-buttonpanel">
          <div class="buttons">
            <!-- reset button -->
            <button
              class="button devbar-button has-tooltip-arrow has-tooltip-bottom"
              data-tooltip="Reset entire state"
              @click="resetLocalState()"
            >
              <FAIcon icon="fa-solid fa-arrow-rotate-left" />
            </button>

            <!-- config button -->
            <ConfigDropDown></ConfigDropDown>

            <button
              class="button devbar-button has-tooltip-arrow has-tooltip-bottom"
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
              <template v-else-if="api.global.db_changes && api.global.db_connected">
                <FAIcon icon="fa-solid fa-rotate" class="outofsync" />
              </template>
              <template v-else>
                <FAIcon icon="fa-solid fa-rotate" class="insync" />
              </template>
              <template v-if="!api.global.db_connected">
                &nbsp;&nbsp;|&nbsp;&nbsp;
                <CircleProgress
                  :percentage="Math.round(api.local.approx_data_size / 1048576) * 100"
                  :size="12"
                  :strokeWidth="40"
                  slicecolor="#aaa"
                  basecolor="#aaa"
                />
              </template>
              <template v-else>
                &nbsp;&nbsp;|&nbsp;&nbsp;

                <CircleProgress
                  :percentage="Math.round(api.local.approx_data_size / 1048576) * 100"
                  :size="12"
                  :strokeWidth="40"
                  slicecolor="hsl(var(--bulma-button-h), var(--bulma-button-s), calc(var(--bulma-button-background-l) + var(--bulma-button-background-l-delta)))"
                  basecolor="var(--status-green)"
                />
              </template>
            </button>

            <!-- randomization button -->
            <RandomizationDropDown></RandomizationDropDown>

            <!-- state variable buttons -->
            <StateVarsDropDown></StateVarsDropDown>

            <!-- route info buttons -->
            <RouteInfoDropDrop></RouteInfoDropDrop>

            <div class="devbar-stepper">
              <Stepper></Stepper>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
.devbar {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  position: relative;
  z-index: 1000;
}

.devbar-subtitle {
  padding-right: 20px;
  display: none;
  white-space: nowrap;
}

.devbar-menu {
  flex-grow: 1;
  flex-shrink: 0;
  align-items: stretch;
  display: flex;
  z-index: 999;
}

.devbar {
  font-size: 13px;
  background: var(--dev-bar-light-grey); /*rgb(63, 160, 149);*/
  color: var(--dev-bar-text);
  border-bottom: var(--dev-bar-lines);
  min-height: 32px;
  max-height: 32px;
}

.devbar-start {
  justify-content: flex-start;
  margin-inline-end: auto;
  display: flex;
  align-items: stretch;
  flex-shrink: 3;
}

@media screen and (max-width: 830px) {
  .devbar-start {
    display: none;
  }
}

.devbar-title {
  padding-top: 8px;
  font-weight: 500;
  padding-left: 10px;
}

.devbar-end {
  justify-content: flex-end;
  margin-inline-start: auto;
  display: flex;
  align-items: stretch;
}

.devbar-item {
  align-items: center;
  display: flex;
}

.devbar-buttonpanel {
  padding-top: 0px;
  padding-left: 10px;
  padding-right: 10px;
  border-left: var(--dev-bar-lines);
  background-color: var(--dev-bar-mild-grey); /*rgb(63, 160, 149);*/
}

.devbar-button {
  font-size: 0.65rem;
  height: 2em;
}

@media screen and (max-width: 725px) {
  .devbar-fulltitle {
    display: none;
  }
  .devbar-buttonpanel {
    border-left: none;
    background-color: #eeeeee; /*rgb(63, 160, 149);*/
  }
  .devbar {
    border-left: 0.01em solid #b5b5b5;
    background-color: #eeeeee; /*rgb(63, 160, 149);*/
  }
  .devbar-subtitle {
    display: inline;
  }
  .devbar-stepper {
    display: none;
  }
}
</style>

<style scoped>
.disconnected {
  color: var(--status-red);
}
.connected {
  color: var(--status-green);
}
.outofsync {
  color: var(--status-yellow);
}
.insync {
  color: var(--status-green);
}

a:hover {
  color: #10dffa;
}

.jumper {
  padding-top: 4px;
  background-color: #dddddd;
}

.navbar {
  font-size: 13px;
  background: #f7f7f7; /*rgb(63, 160, 149);*/
  color: #000;
  border-bottom: 0.01em solid #b5b5b5;
  height: 0px;
  padding: 0px;
  padding-left: 10px;
  margin: 0px;
  min-height: 32px;
  text-align: center;
}

.field {
  margin: 0px;
  margin-top: 3px;
}
.is-jump-bar {
  font-size: 0.65rem;
  height: 2em;
  margin: 0px;
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
  border-left: 0.01em solid #b5b5b5;
  background-color: #eeeeee; /*rgb(63, 160, 149);*/
}
</style>
