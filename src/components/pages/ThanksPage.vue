<script setup>
import useStepRoute from '@/composables/StepRoute'

const { next, prev } = useStepRoute()
</script>

<template>
    <div class="prompt">
        <h1  class="title is-3">Thanks</h1>
        <button  class="button is-success is-light" @click="$router.push(next)">next</button>
    </div>
</template>