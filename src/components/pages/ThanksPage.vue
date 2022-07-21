<script setup>
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/steproute'
import useSmileStore from '@/stores/smiledata' // get access to the global store
import { onMounted } from 'vue';

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { nextFn, prevFn } = useStepRoute()
const next = nextFn()
const prev = prevFn()

if(route.meta.progress) smilestore.global.progress = route.meta.progress


function finish(goto) { 
    smilestore.saveData()
    router.push(goto)
}
</script>

<template>
    <div class="page">
        <h1 class="title is-3"><fa-icon icon="fa-solid fa-square-check" /></h1>
        
        <div class="payment" v-if="smilestore.recruitmentService=='prolific'">
            <h1 class="title is-3">Thanks, let's begin the payment process!</h1>
            <p>
            Please click the button below to being the process of payment.  This will notify Prolific you 
            successfully completed the task.  Your work will be approved with hours and any performance
            related bonuses will be assigned.<br><br>
            <a href="https://app.prolific.co/submissions/complete?cc=I2PWSFRG" class="button is-info">Submit my work to Prolific &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></a>
            </p>
        </div>
        <div class="payment" v-if="smilestore.recruitmentService=='crowdresearch'">
            <h1 class="title is-3">Thanks, let's begin the payment process!</h1>
            <p>
                Please click the button below to being the process of payment.  This will notify CrowdResearch you
                successfully completed the task.  Your work will be approved with hours and any performance
                related bonuses will be assigned.<br><br>
                <a href="https://crowdresearch.com" class="button is-info">Submit my work to CrowdResearch &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></a>
            </p>
        </div>
        <div class="payment" v-if="smilestore.recruitmentService=='mechanicalturk'">
            <p>
                <h1 class="title is-3">Thanks, let's begin the payment process!</h1>
                Please click the button below to being the process of payment.  This will notify Mechanical Turk you
                successfully completed the task.  Your work will be approved with hours and any performance
                related bonuses will be assigned.<br><br>
                <a href="https://murk.com" class="button is-info">Submit my work to Mechanical Turk &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></a>
            </p>
        </div>
        <div class="payment" v-if="smilestore.recruitmentService=='citizen'">
            <p>
                <h1 class="title is-3">Thanks, let's begin the payment process!</h1>
                Please click the button below to being the process of payment.  This will notify [Citizen Science?] you
                successfully completed the task.  Your work will be approved with hours and any performance
                related bonuses will be assigned.<br><br>
                <a href="http://gureckislab.org" class="button is-info">Submit my work &nbsp;<fa-icon icon="fa-solid fa-arrow-right" /></a>
            </p>
        </div>
        <div class="payment" v-if="smilestore.recruitmentService=='web'">
            <p>
                <h1 class="title is-3">Thanks for your contribution to science!</h1>
                Your data have been successfully recorded and you can close this window or navigate to another page.
            </p>
        </div>
    </div>
</template>

<style scoped>
.payment {
    width: 60%;
    margin: auto;
}
</style>