<script setup>
const props = defineProps({
    imgfile: String,
    caption: String
})
</script>

<template>
    <img :src="imgfile" :alt="caption"/>
</template>

<style>
.dark img {
    filter: invert(1);
}
img {
    filter: invert(0);
}
</style>