<script setup>
import { inject } from 'vue'
import useStepRoute from '@/composables/StepRoute'


const smileconfig = inject('smileconfig')

const { next, prev } = useStepRoute()
</script>

<template>
    <h1 class="title is-3">Welcome to</h1>
    <p class="is-family-monospace">{{ smileconfig.code_name }}</p>
    <br>
    <button class="button is-success is-light" @click="$router.push(next)">next</button>
</template>
