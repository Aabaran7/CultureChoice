<script setup>
import { inject } from 'vue'
import useStepRoute from '@/composables/StepRoute'


const smileconfig = inject('smileconfig')

const { next, prev } = useStepRoute()
</script>

<template>
    <h1>Welcome to <pre>{{ smileconfig.code_name }}</pre></h1>
    <button @click="$router.push(next)">next</button>
</template>

<style scoped>
pre {
    font-size: 20px;
}
</style>