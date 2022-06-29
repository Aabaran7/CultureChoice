<script setup>
import useStepRoute from '@/composables/StepRoute'

const { next, prev } = useStepRoute()
</script>

<template>
    <h1>Informed Consent</h1>
    <button @click="$router.push(next)">next</button>
</template>