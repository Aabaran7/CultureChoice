<script setup>
import useStepRoute from '@/composables/StepRoute'

const { next, prev } = useStepRoute()
</script>

<template>
    <div>
        <h1>Thanks</h1>
        <button @click="$router.push(next)">next</button>
    </div>
</template>