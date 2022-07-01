<script setup>
import useStepRoute from '@/composables/StepRoute'

const { next, prev } = useStepRoute()
</script>

<template>
    <div class="prompt">
        <h1 class="title is-3">Captcha</h1>
        <br>
        <button class="button is-success is-light" @click="$router.push(next)">next &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></button>
    </div>
</template>