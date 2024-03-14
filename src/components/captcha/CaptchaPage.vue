<script setup>
import { shallowRef, ref, computed } from 'vue'

import CaptchaInstructionsText from '@/components/captcha/CaptchaInstructionsText.vue'
import CaptchaTrialImageCategorization from '@/components/captcha/CaptchaTrialImageCategorization.vue'
import CaptchaTrialMotorControl from '@/components/captcha/CaptchaTrialMotorControl.vue'
import CaptchaTrialTextComprehension from '@/components/captcha/CaptchaTrialTextComprehension.vue'
import CaptchaTrialStroop from '@/components/captcha/CaptchaTrialStroop.vue'

// import and initalize smile API
import useSmileAPI from '@/composables/smileapi'
const api = useSmileAPI()


const pages = [
  CaptchaInstructionsText,
  //CaptchaTrialTextComprehension,
  CaptchaTrialImageCategorization,
  CaptchaTrialMotorControl,
]


const currentTab = computed(() => {
  return pages[api.getCurrentTrial()]
})
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

function next_trial() {
  if (api.getCurrentTrial() >= pages.length - 1) {
    //api.resetPageTracker() // you coudl reset when you leavr but why?
    finish()
  }
  api.incrementTrial()

}

function finish() {
  // smilestore.saveData()
  api.stepNextRoute()
}

</script>

<template>
  <div class="page">
    <!-- Component changes when currentTab changes -->
    <component :is="currentTab" @next-page-captcha="next_trial()">
    </component>
  </div>
</template>

<style scoped></style>
