<script setup>
import { ref } from 'vue'
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
const agree = ref(false)
</script>

<template>
    <div class="content">
        <div class="columns">
            <div class="column is-one-third">
                <p class="is-size-8 leftalign emph">
                    Informed consent is an important part of a research study verifying that you are 
                    participating willingly and know your rights. Please take the time to read
                    the consent form (you can scroll the page if it not entirely visible).
                </p>
                <hr>
                <p class="leftalign"><input type="checkbox" v-model='agree'/> I have read 
                and agree to the terms of the consent form.  I am also over 18 years old.</p>
                <hr>
                <button class="button is-success is-light" v-if='agree' @click="finish(next)">
                    Let's start &nbsp;<fa-icon icon="fa-solid fa-arrow-right" />
                </button>

            </div>
            <div class="column has-background-info-light informedconsent">
                <InformedConsentText/>
            </div>
        </div>
    </div>
</template>

<style scoped>

.leftalign {
    text-align: left;
}

.emph {
    font-weight: 600;
}
.content {
    margin: 50px;
}

.column {
    padding: 40px;
}

.informedconsent {
    border-radius: 15px;
}
</style>