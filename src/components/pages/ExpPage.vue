<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import * as random from '@/randomization'

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.global.progress = route.meta.progress

const conditions1 = ["A", "B", "C"]
const cond1 = random.sampleWithoutReplacement(conditions1, 1)[0]
smilestore.setCondition("condition1", cond1)

const conditions2 = ["X", "Y"]
const cond2 = random.sampleWithoutReplacement(conditions2, 1)[0]
smilestore.setCondition("condition2", cond2)


function finish(goto) { 
    // smilestore.saveData()
    if(goto) router.push(goto)
}
</script>

<template>
    <div class="page">
        <h1 class="title is-3">Experiment</h1>
        <p class="is-size-5">Randomly assigned condition 1 is {{cond1}} </p>
        <p class="is-size-5">Randomly assigned condition 2 is {{cond2}} </p>
        <hr>
        <button class="button is-success is-light" id='finish' @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>
