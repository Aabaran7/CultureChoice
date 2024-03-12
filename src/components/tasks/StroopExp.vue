<script setup>
// A Basic Stroop Experiment

// first import from basic functions from Vue
import { ref, computed } from 'vue'

// import and create the Timeline stepper which advances/retreats
// through the routes on the timeline
import useTimelineStepper from '@/composables/timelinestepper'
const { stepNextRoute, stepPrevRoute } = useTimelineStepper()

// if you need to save data import and create the smilestore
import useSmileStore from '@/stores/smiledata'
const smilestore = useSmileStore()
if (smilestore.config.mode == 'development') smilestore.removePageAutofill() // should put there everywhere on init

// if you need low-level access to the router do it here
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

// this progress bar is not implemented and a little hard so lets pass for now
//if (route.meta.progress) smilestore.global.progress = route.meta.progress

// import seeded randomization function for this component/route
// random seeding is unique to each component/route
import { shuffle } from '@/randomization'

// import the trial stepper functionality which advances linearly through
// a set of trials
import { useTrialStepper } from '@/composables/trialstepper'

// import tool for recording keypresses
import { onKeyDown } from '@vueuse/core'

// import tool for recording mouse position if required
// import { useMouse } from '@vueuse/core'
// const { x, y, sourceType } = useMouse()

/*
   Next we need to define the trials for the experiment.  Create
   a list composed of objects where each entry in the list is a trial
   and the keys of the object are the variables that define each trial.
   For example here we define a stroop experiment and so we mention
   the word to display, the color of the word, and the condition of the
   trial for later analysis.
*/
var trials = [
  { word: 'SHIP', color: 'red', condition: 'unrelated' },
  { word: 'MONKEY', color: 'green', condition: 'unrelated' },
  { word: 'ZAMBONI', color: 'blue', condition: 'unrelated' },
  { word: 'RED', color: 'red', condition: 'congruent' },
  { word: 'GREEN', color: 'green', condition: 'congruent' },
  { word: 'BLUE', color: 'blue', condition: 'congruent' },
  { word: 'GREEN', color: 'red', condition: 'incongruent' },
  { word: 'BLUE', color: 'green', condition: 'incongruent' },
  { word: 'RED', color: 'blue', condition: 'incongruent' },
]

// next we shuffle the trials
trials = shuffle(trials)

//const index = smilestore.getPage[route.name]
// now we create the trial stepper which will advance through the trials.
// this method includes a callback function that is called when the
// last trial is shown.  this might be where you do some additional data saving
// or analysis (e.g., if you are showing the subject performance feedback about
// their performance on the task).  it called the finalize() function which is
// defined below
const { nextTrial, prevTrial } = useTrialStepper(trials, route.name, () => {
  finalize()
})

const trial = computed(() => {
  return trials[smilestore.getPage[route.name]]
})

// Handle the key presses for the task
// onKeyDown is a composable from the VueUse package
// it takes a list of keys to list for each time a key
// is pressed runs the provided function.
onKeyDown(
  ['r', 'R', 'g', 'G', 'b', 'B'],
  (e) => {
    console.log('got keypress', smilestore.getPage[route.name])
    if (smilestore.getPage[route.name] < trials.length) {
      e.preventDefault()
      console.log('pressed ', e)
      if (['r', 'R'].includes(e.key)) {
        console.log('red')
      } else if (['g', 'G'].includes(e.key)) {
        console.log('green')
      } else if (['b', 'B'].includes(e.key)) {
        console.log('blue')
      }
      //smilestore.incrementPageTracker(route.name)
      nextTrial()
    }
  },
  { dedupe: true }
)

// load up the trials including any randomization based on the random see
// initialize the state of the component
// set up the call backs that take you through the task

function finalize() {
  // sort out what data you are putting in the smile store here?
  console.log('finished, so will save data and stuff')
  smilestore.incrementPageTracker(route.name)
}

// TODO
// -- save data

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
    <!-- Show this for each trial -->
    <div class="strooptrial"
      v-if="smilestore.getPage[route.name] < trials.length">
      {{ smilestore.getPage[route.name] + 1 }} / {{ trials.length }}
      <h1 class="title is-1 is-huge" :class="trial.color">{{ trial.word }}</h1>
      <p id="prompt">Type "R" for Red, "B" for blue, "G" for green.</p>
    </div>

    <!-- Show this when you are done with the trials and offer a button
         which will advance to the next route -->
    <div class="endoftask" v-else>
      <p id="prompt">Thanks! You are finished with this task and can move on.
      </p>
      <button class="button is-success is-light" id="finish"
        @click="stepNextRoute()">
        Continue &nbsp;
        <FAIcon icon="fa-solid fa-arrow-right" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/*  pick your colors for the stroop design here */
.red {
  color: rgb(240, 75, 75);
}

.blue {
  color: rgb(118, 193, 237);
}

.green {
  color: rgb(123, 199, 123);
}
</style>
