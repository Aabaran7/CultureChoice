<script setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/steproute'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import StudyPreviewText from '@/components/atoms/StudyPreviewText.vue'

// const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

// const { next, prev } = useStepRoute()

if(route.meta.progress) smilestore.global.progress = route.meta.progress

const mturkPreview = ref(true)

onMounted(() => {
    const urlParams = route.query
    if (urlParams.assignmentId && urlParams.hitId && urlParams.workerId) {
        if (urlParams.assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE') {
            console.log('AMT mode, but no assignment (preview mode)')
            // supposed to show the ad here
            mturkPreview.value = true
        } else {
            console.log('AMT mode, with assignment')
            mturkPreview.value = false
        }
  }
})

// function finish(goto) { 
//     smilestore.saveData()
//     router.push(goto)
// }
</script>

<template>
    <div class="page">
        <StudyPreviewText v-if="mturkPreview"></StudyPreviewText>
        <div v-else>
            <h1 class="title is-3">Launch the main task</h1>
            <a href="/#/welcome/?" class="button is-info" id='launch_window'>Begin Task in New Window</a>
        </div>

    </div>
</template>
