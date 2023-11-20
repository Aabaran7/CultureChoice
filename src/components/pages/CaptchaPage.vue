<script setup>
import { shallowRef, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

import CaptchaInstructionsText from '@/components/atoms/CaptchaInstructionsText.vue'
import CaptchaTrialImageCategorization from '@/components/organisms/CaptchaTrialImageCategorization.vue'
import CaptchaTrialMotorControl from '@/components/organisms/CaptchaTrialMotorControl.vue'
import CaptchaTrialTextComprehension from '@/components/organisms/CaptchaTrialTextComprehension.vue'
import CaptchaTrialStroop from '@/components/organisms/CaptchaTrialStroop.vue'

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if (route.meta.progress) smilestore.global.progress = route.meta.progress

function finish(goto) {
  // smilestore.saveData()
  if (goto) router.push(goto)
}

const pages = [
  CaptchaInstructionsText,
  CaptchaTrialImageCategorization,
  CaptchaTrialMotorControl,
  CaptchaTrialTextComprehension,
  CaptchaTrialStroop,
]
const page_indx = ref(smilestore.getPage)
const currentTab = shallowRef(pages[page_indx.value])
// captcha steps

// a dynamic loader for different trial types which is randomized?
// each trial type is a simple game that just stores the data from the subject
// games include tests of 10 possible games

// 1 - perceptual motor behavior like Operation
// 2 - human like categorization (quickly place in piles)
// 3 - text comprehension
// 4 - foraging in semantic memory
// 5 - human brain should show stroop interference
// 6 -

function next_trial(goto) {
  page_indx.value = smilestore.incrementPageTracker()
  if (page_indx.value >= pages.length) {
    smilestore.resetPageTracker()
    if (goto) router.push(goto)
  } else {
    currentTab.value = pages[page_indx.value]
  }
}
</script>

<template>
  <div class="page">
    <!-- Component changes when currentTab changes -->
    <component :is="currentTab" @next-page-captcha="next_trial(next())"></component>
  </div>
</template>

<style scoped></style>
