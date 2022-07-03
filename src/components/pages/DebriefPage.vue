<script setup>
//import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'

const router = useRouter()
const route = useRoute()

import useSmileStore from '@/stores/smiledata'
import DebriefText from '@/components/atoms/DebriefText.vue'; // get access to the global store
//const smileconfig = inject('smileconfig')
const smileStore = useSmileStore()

const { next, prev } = useStepRoute()

if(route.meta.progress) smileStore.global.progress = route.meta.progress


function finish(goto) { 
    router.push(goto)
}
</script>

<template>
    <div class="content prompt">
        <h1 class="title is-3">What was that about?</h1>
        <DebriefText />
        <button class="button is-success is-light" @click="finish(next)">next &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

