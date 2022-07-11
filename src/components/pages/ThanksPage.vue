<script setup>
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'
import useSmileStore from '@/stores/smiledata' // get access to the global store

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { next, prev } = useStepRoute()

if(route.meta.progress) smilestore.global.progress = route.meta.progress


function finish(goto) { 
    smilestore.saveData()
    router.push(goto)
}
</script>

<template>
    <div class="page">
        <h1 class="title is-3"><fa-icon icon="fa-solid fa-square-check" /></h1>
        <h1 class="title is-3">Thanks</h1>
        <button class="button is-success is-light" id='finish' @click="finish(next)" v-if="smilestore.config.mode=='development'">next &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>
