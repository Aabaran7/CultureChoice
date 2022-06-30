<script setup>
import { inject } from 'vue'
import useStepRoute from '@/composables/StepRoute'
const smileconfig = inject('smileconfig')

const { next, prev } = useStepRoute()
</script>

<template>
    <div class="prompt">
        <h1  class="title is-3">Thanks</h1>
        <button v-if="smileconfig.mode=='development'" class="button is-success is-light" @click="$router.push(next)">next</button>
    </div>
</template>