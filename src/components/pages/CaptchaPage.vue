<script setup>
import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'

const router = useRouter()
const route = useRoute()

import useSmileStore from '@/stores/smiledata' // get access to the global store
const smileconfig = inject('smileconfig')
const smileStore = useSmileStore()

const { next, prev } = useStepRoute()

if(route.meta.progress) smileStore.global.progress = route.meta.progress

function finish(goto) { 
    router.push(goto)
}
</script>

<template>
    <div class="content prompt">
        <h1 class="title">Lets play a game!</h1>
        <p class="is-size-5">
            Before we begin we'd like you do solve a couple quick problems for us,
            just to warm up your brain.
        </p>
        <button class="button is-success is-light" @click="finish(next)">next &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>