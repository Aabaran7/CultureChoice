<script setup>
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'

const router = useRouter()
const route = useRoute()

import useSmileStore from '@/stores/smiledata' // get access to the global store
const smilestore = useSmileStore()

const { next, prev } = useStepRoute()

smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'


if(route.meta.progress) smilestore.global.progress = route.meta.progress


function finish(goto) { 
    router.push(goto)
}
</script>


<template>
    <div class="page">
        <h1 class="title is-3">Demographic Questionaire</h1>
        <p>To do this</p>
        <br>
        <button class="button is-success is-light" @click="finish(next)">next &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>
