<script setup>
import { ref } from 'vue'
import useSmileStore from '@/stores/smiledata'

// load sub-components used in this compomnents
import InformedConsentText from '@/components/atoms/InformedConsentText.vue'

const smilestore = useSmileStore() // get the global store

/* these just toggle interface elements so are state local to the component */
const showconsentmodal = ref(false) // reactive
function toggleConsent() {
    showconsentmodal.value=!showconsentmodal.value  // have to use .value in <script> when using ref()
}

const showwithdrawmodal = ref(false) // reactive
function toggleWithdraw() {
    showwithdrawmodal.value=!showwithdrawmodal.value // have to use .value in <script> when using ref()
}

const showreportissuemodal = ref(false) // reactive
function toggleReport() {
    showreportissuemodal.value=!showreportissuemodal.value // have to use .value in <script> when using ref()
}


</script>
<template>
    <div class="navbar" role="navigation" aria-label="main navigation" >
        <div class="navbar-brand">
            <a class="navbar-item" href="https://gureckislab.org" >
                <img src="@/assets/nyu.png" width="90">
            </a>
            <div class="navbar-item" >
                <p class="is-size-7 studyinfo">Study: {{ smilestore.config.code_name }}<br>Version: {{ smilestore.config.github.last_commit_hash }}</p>
            </div>
        </div>
        <div id="navbarBasicExample" class="navbar-menu is-active">
            <div class="navbar-end">
                <div class="navbar-item" >
                    <div class="buttons">
                        <button class="button is-info is-small is-light" v-if="smilestore.isConsented" @click="toggleConsent()">
                            <fa-icon icon="magnifying-glass" />&nbsp;&nbsp;View consent
                        </button>
                        <button class="button is-danger is-small is-light" v-if="smilestore.isConsented && !smilestore.isDone" @click="toggleWithdraw()">
                            <fa-icon icon="circle-xmark" />&nbsp;&nbsp;Withdraw
                        </button>
                        <button class="button is-warning is-small is-light" @click="toggleReport()">
                            <fa-icon icon="hand" />&nbsp;&nbsp;Report issue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- modal for viewing consent form -->
    <div class="modal" :class="{'is-active': showconsentmodal}">
    <div class="modal-background" @click="toggleConsent()"></div>
    <div class="modal-content">
        <div class="modaltext">
        <InformedConsentText /> <!-- load text of consent form -->
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="toggleConsent()"></button>
    </div>

    <!-- modal for withdrawing from study -->
    <div class="modal" :class="{'is-active': showwithdrawmodal}">
    <div class="modal-background" @click="toggleWithdraw()"></div>
    <div class="modal-content">
        <div class="modaltext">
        Add a withdraw form here
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="toggleWithdraw()"></button>
    </div>

    <!-- modal for reporting issues -->
    <div class="modal" :class="{'is-active': showreportissuemodal}">
    <div class="modal-background" @click="toggleReport()"></div>
    <div class="modal-content">
        <div class="modaltext">
            Add a report issues form here
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="toggleReport()"></button>
    </div>

</template>

<style scoped> /* scoped css for this component */
.modaltext {
    background-color: #fff;
    padding: 30px;
}
.navbar {
    z-index:10;
    background-color: v-bind(smilestore.global.status_bar_bg_color);
    color: v-bind(smilestore.global.status_bar_text_color);
}

.modal-content {
    width: 80%;
}
.studyinfo {
    text-align: left;
    color: v-bind(smilestore.global.status_bar_text_color);
}
.navbar-start {
    margin-right: 10px;
}
.navbar-end {
    margin-left: auto;
}
</style>