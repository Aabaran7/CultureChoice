<script setup>
//import { inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'

import InformedConsentText from '@/components/atoms/InformedConsentText.vue';
const router = useRouter()
const route = useRoute()

import useSmileStore from '@/stores/smiledata'
//const smileconfig = inject('smileconfig')
const smileStore = useSmileStore()

const { next, prev } = useStepRoute()

if(route.meta.progress) smileStore.global.progress = route.meta.progress


function finish(goto) { 
    smileStore.data.consented=true
    router.push(goto)
}
</script>

<template>
    <div class="content">
        <div class="columns">
            <div class="column is-one-third">
                <p class="is-size-8 leftalign">
                    Informed consent is an important part of a research study verifying that you are 
                    participating willingly and know your rights. Please take the time to read
                    the consent form (you can scroll the page if it not entirely visible).
                </p>
                <button class="button is-success is-light" @click="finish(next)">
                    next &nbsp;<fa-icon icon="fa-solid fa-arrow-right" />
                </button>

            </div>
            <div class="column has-background-info-light informedconsent">
                <div class="columns">
                    <InformedConsentText/>
                </div>        
            </div>
        </div>
    </div>
</template>

<style scoped>

.leftalign {
    text-align: left;
}
.content {
    margin: 50px;
}
</style>