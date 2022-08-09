<script setup>
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useTimelineStepper()

if(route.meta.progress) smilestore.global.progress = route.meta.progress

const conditionsBetween = smilestore.data.conditions_between

function finish(goto) { 
    // smilestore.saveData()
    if(goto) router.push(goto)
}
</script>

<template>
    <div class="page">
        <h1 class="title is-3">Experiment</h1>
        <p>Between subjects conditions are:</p>
        <p v-for="condbt in conditionsBetween">{{ condbt }}</p>
        <button class="button is-success is-light" id='finish' @click="finish(next())">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>
