<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata'

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if (route.meta.progress) smilestore.global.progress = route.meta.progress

// computed property based on condition in data
const instText = computed(() => {
  if (smilestore.getConditions.instructions === 'version1') {
    return 'instructions version 1'
  }
  if (smilestore.getConditions.instructions === 'version2') {
    return 'instructions version 2'
  }
  if (smilestore.getConditions.instructions === 'version3') {
    return 'instructions version 3'
  }
  return 'no condition set'
})

function finish(goto) {
  // smilestore.saveData()
  if (goto) router.push(goto)
}
</script>

<template>
  <div class="page">
    <h1 class="title is-3">Instructions</h1>
    <p class="has-text-center is-size-5">{{ instText }}</p>
    <hr />
    <button class="button is-success is-light" id="finish" @click="finish(next())">
      next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" />
    </button>
  </div>
</template>
