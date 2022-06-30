<script setup>
import useStepRoute from '@/composables/StepRoute'

const { next, prev } = useStepRoute()
</script>

<template>
    <h1 class="title is-3">Debrief</h1>
    <button class="button is-success is-light"  @click="$router.push(next)">next</button>
</template>

