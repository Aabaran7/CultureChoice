<script setup>
import { ref, inject } from 'vue'
import useSmileStore from '@/stores/smiledata'
import InformedConsentText from '@/components/atoms/InformedConsentText.vue'
const smileconfig = inject('smileconfig')
const smilestore = useSmileStore()

const showconsent = ref(false)
const reportissue = ref(false)
function toggleReport() {
    reportissue.value=!reportissue.value
}
function toggleConsent() {
    showconsent.value=!showconsent.value
}
</script>

<template>
    <div class="navbar" role="navigation" aria-label="main navigation" >
        <div class="navbar-brand">
            <a class="navbar-item" href="https://bulma.io" >
                <img src="@/assets/arts_science_short_black.png" width="220">
            </a>
            <div class="navbar-item" >
                <p class="is-size-7 studyinfo">Study: {{ smileconfig.code_name }}<br>Version: {{ smileconfig.github.last_commit_hash }}</p>
            </div>
        </div>
        <div id="navbarBasicExample" class="navbar-menu is-active">
            <div class="navbar-end">
                <div class="navbar-item" >
                    <div class="buttons">
                        <button class="button is-info is-small" v-if="smilestore.data.consented" @click="toggleConsent()">
                            <fa-icon icon="magnifying-glass" />&nbsp;&nbsp;<strong>View consent</strong>
                        </button>
                        <button class="button is-danger is-small" v-if="smilestore.data.consented">
                            <fa-icon icon="circle-xmark" />&nbsp;&nbsp;<strong>Withdraw</strong>
                        </button>
                        <button class="button is-warning is-small" @click="toggleReport()">
                            <fa-icon icon="hand" />&nbsp;&nbsp;<strong>Report an issue</strong>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal" :class="{'is-active': showconsent}">
    <div class="modal-background"></div>
    <div class="modal-content">
        <!-- Any other Bulma elements you want -->
        <InformedConsentText />
    </div>
    <button class="modal-close is-large" aria-label="close" @click="toggleConsent()"></button>
    </div>


    <div class="modal" :class="{'is-active': reportissue}">
    <div class="modal-background"></div>
    <div class="modal-content">
        <!-- Any other Bulma elements you want -->
        <iframe sandbox="allow-scripts allow-popups allow-forms allow-same-origin" width="100%" height="760px" style="border: 0; overflow: hidden; overflow-x: auto" src="https://forms.helpdesk.com?licenseID=1182513850&contactFormID=7fff6e79-358e-48ee-8a99-40a0bac44c64">    Your browser does not allow embedded content.  </iframe>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="toggleReport()"></button>
    </div>

</template>

<style scoped>
.navbar {
    z-index:10
}
.studyinfo {
    text-align: left;
}
.navbar-start {
    margin-right: 10px;
}
.navbar-end {
    margin-left: auto;
}
</style>