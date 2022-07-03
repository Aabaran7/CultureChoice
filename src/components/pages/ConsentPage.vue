<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'

import Toggle from '@vueform/toggle' // https://github.com/vueform/toggle
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
            <div class="column has-background-info-light informedconsent">
                <InformedConsentText/>
            </div>
            <div class="column is-one-third">
                <p class="leftalign emph">
                    Informed consent is an important part of a research study verifying that you are 
                    participating willingly and know your rights. Please take the time to read
                    the consent form (you can scroll the page if it not entirely visible).
                </p>
                <hr>


   

                

                <p class="leftalign">
                    I have read and agree to the terms of the 
                    consent form.  I am also over 18 years old.
                </p>

                <p>
                <Toggle v-model="agree"  
                on-label="I consent!"
                off-label="Continue" 
                class="widetoggle"/>
                </p>

                <hr>
                <button class="button is-success is-light" v-if='agree' @click="finish(next)">
                    Let's start &nbsp;<fa-icon icon="fa-solid fa-arrow-right" />
                </button>

            </div>

        </div>
    </div>
</template>

<style scoped>

.widetoggle{
  --toggle-width: 6rem;
}


.leftalign {
    text-align: left;
    font-size: 0.9em;
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

.form {
    padding: 0px;
}

.informedconsent {
    border-radius: 15px;
}
</style>