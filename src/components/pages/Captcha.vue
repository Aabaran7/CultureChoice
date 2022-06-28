<script setup>
import useStepRoute from '@/composables/StepRoute'

const { next, prev } = useStepRoute()
</script>

<template>
    <div>
        <h1>Captcha</h1>
        <button @click="$router.push(next)">next</button>
    </div>
</template>