<script setup>
// maybe a smile store component
// reorganize files to make more clear what you are or are not expected to edit
//

import { ref } from 'vue'
import useTimelineStepper from '@/composables/timelinestepper'
const { stepNextRoute, stepPrevRoute } = useTimelineStepper()

import useTrialStepper from '@/composables/trialstepper'

// if you need to acess the global store do it here
import useSmileStore from '@/stores/smiledata'
const smilestore = useSmileStore()

// if you need low-level access to the router do it here
//import { useRouter, useRoute } from 'vue-router'
// const router = useRouter()
// const route = useRoute()

// this progress bar is not implemented and a little hard so lets pass for now
//if (route.meta.progress) smilestore.global.progress = route.meta.progress

import { shuffle } from '@/randomization'

var trials = [
  {
    task: 'unusual',
    sentence: 'The dog ate the _____.',
    options: ['Meal', 'Bone', 'Food', 'Sun'],
  },
  {
    task: 'unusual',
    sentence: 'The cat ate the _____.',
    options: ['Fish', 'Words', 'Food', 'Mouse'],
  },
  {
    task: 'unusual',
    sentence: 'The fish ate the _____.',
    options: ['Water', 'Food', 'Car', 'Moon'],
  },
]

const { index, trial, nextTrial, prevTrial } = useTrialStepper(trials, () => {
  stepNextRoute(finalize())
})

// const index = ref(0)
// trials = shuffle(trials) // shuffle is not "in place"

// load up the trials including any randomization based on the random see
// initialize the state of the component
// set up the call backs that take you through the task

function finalize() {
  // sort out what data you are putting in the smile store here?
  console.log('finished ')
}

// custom advance to next route when we finish showing all the trials
// function advance() {
//   if (index.value >= trials.length - 1) {
//     stepNextRoute(finalize())
//   } else {
//     index.value += 1
//   }
// }
</script>

<template>
  <div class="page">
    <h1 class="title is-3">Task 2</h1>
    {{ trial.sentence }}/{{ index }}<br /><br />
    <button class="button is-success is-light" id="finish" @click="prevTrial()" v-if="index > 0">
      <FAIcon icon="fa-solid fa-arrow-left" />&nbsp; prev
    </button>
    &nbsp;&nbsp;&nbsp;
    <button class="button is-success is-light" id="finish" @click="nextTrial()">
      next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" />
    </button>
  </div>
</template>
