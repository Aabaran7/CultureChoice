<script setup>
import useStepRoute from '@/composables/StepRoute'

const { next, prev } = useStepRoute()
</script>

<template>
    <div>
        <h1>Welcome</h1>
        <button @click="$router.push(next)">next</button>
    </div>
</template>