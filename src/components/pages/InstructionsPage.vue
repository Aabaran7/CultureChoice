<script setup>
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/steproute'
import useSmileStore from '@/stores/smiledata'

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { nextFn, prevFn } = useStepRoute()
const next = nextFn()
const prev = prevFn()

if(route.meta.progress) smilestore.global.progress = route.meta.progress

function finish(goto) { 
    smilestore.saveData()
    router.push(goto)
}
</script>

<template>
    <div class="page">
        <h1 class="title is-3">Instructions</h1>
        <button class="button is-success is-light" id='finish' @click="finish(next)">next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>

