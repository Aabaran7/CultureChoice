<script setup>
import useStepRoute from '@/composables/StepRoute'
import useSmileStore from '@/stores/smiledata'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const { next, prev } = useStepRoute()

const smilestore = useSmileStore()

function finish(next) {
  console.log(next)
  smilestore.data.consented=true
  router.push(next)
}
</script>

<template>
    <div class="prompt">
        <h1 class="title is-3">Informed Consent</h1>
        <button class="button is-success is-light" @click="finish(next)">next &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>