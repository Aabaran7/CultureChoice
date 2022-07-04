<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useStepRoute from '@/composables/StepRoute'

import Toggle from '@vueform/toggle' // https://github.com/vueform/toggle
import InformedConsentText from '@/components/atoms/InformedConsentText.vue';
const router = useRouter()
const route = useRoute()

//http://haacked.com/archive/2007/09/11/honeypot-captcha.aspx/
import useSmileStore from '@/stores/smiledata'
const smilestore = useSmileStore()

smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'

const { next, prev } = useStepRoute()

if(route.meta.progress) smilestore.global.progress = route.meta.progress


function finish(goto) { 
    smilestore.data.consented=true
    router.push(goto)
}
const agree = ref(false)
</script>

<template>
    <div class="page">
        <div class="content has-background-light">
            <div class="columns">
                <div class="column informedconsent">
                    <InformedConsentText/>
                </div>
                <div class="column is-one-third">
                    <div class="box">
                        <p class="leftalign emph">
                            Informed consent verifies that you are
                            participating willingly and know your rights. Please take the time to read
                            the consent form (you can scroll the page).
                        </p>
                        <hr>
                        <p class="leftalign">
                            I have read and agree to the terms of the
                            consent form.  I also verify I am over 18 years old.
                        </p>
                        <p>
                        <Toggle v-model="agree"
                        on-label="Consented"
                        off-label="Verify"
                        class="widetoggle"/>
                        </p>
        
                        <button class="button is-success is-fullwidth" v-if='agree' @click="finish(next)">
                            Let's start &nbsp;<fa-icon icon="fa-solid fa-arrow-right" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.widetoggle{
  --toggle-width: 5.9rem;
}

.box {
    margin-top: 30px;
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
    margin-top: 0px;
    
    
}

.column {
    padding: 40px;
    padding-top: 0px;
}

.form {
    padding: 0px;
}

.informedconsent {
    border-radius: 15px;
    padding-top: 20px;
}
</style>