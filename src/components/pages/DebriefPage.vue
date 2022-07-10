<script setup>
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'
import useSmileStore from '@/stores/smiledata'
import DebriefText from '@/components/atoms/DebriefText.vue'; // get access to the global store

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
        <h1 class="title is-3">What was that about?</h1>
        <DebriefText />
        <button class="button is-success is-light" @click="finish(next)">next &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

