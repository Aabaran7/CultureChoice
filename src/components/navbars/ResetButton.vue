<script setup>
import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()

function resetLocalState() {
  localStorage.removeItem(api.config.local_storage_key) // delete the local store
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_id`)
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_set`)
  api.resetStore() // reset all the data even

  // go back to the landing page (don't use router because it won't refresh the page and thus won't reset the app)
  const url = window.location.href
  window.location.href = url.substring(0, url.lastIndexOf('#/'))
}
</script>

<template>
  <button
    class="button devbar-button has-tooltip-arrow has-tooltip-bottom"
    data-tooltip="Reset entire state"
    @click="resetLocalState()"
  >
    <FAIcon icon="fa-solid fa-arrow-rotate-left" />
  </button>
</template>
