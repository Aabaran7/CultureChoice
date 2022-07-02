<script setup>
import { ref, inject } from 'vue'
import useSmileStore from '@/stores/smiledata'
const smileconfig = inject('smileconfig')

const smilestore = useSmileStore()
const exp = {
    consented: false,
    working: false,
}
</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
            <img src="https://as.nyu.edu/content/dam/nyu-as/communications/images/VisualIdentityDownloads/AS/logos/arts_science_short_black.png" width="220">
        </a>
        <div class="navbar-item">
            <p class="is-size-7 studyinfo">Study: {{ smileconfig.code_name }}<br>Version: {{ smileconfig.github.last_commit_hash }}</p>
        </div>
    </div>

    <div id="navbarBasicExample" class="navbar-menu is-active">
        <div class="navbar-end">
            <div class="navbar-item">
                <div class="buttons">
                    <a class="button is-info is-small" v-if="smilestore.data.consented">
                        <fa-icon icon="magnifying-glass" />&nbsp;&nbsp;<strong>View consent</strong>
                    </a>
                    <a class="button is-danger is-small" v-if="smilestore.data.consented">
                        <fa-icon icon="circle-xmark" />&nbsp;&nbsp;<strong>Withdraw</strong>
                    </a>
                    <a class="button is-warning is-small" v-if="smilestore.data.working">
                        <fa-icon icon="hand" />&nbsp;&nbsp;<strong>Report an issue</strong>
                    </a>
                </div>
            </div>
        </div>
    </div>
    </nav>


</template>

<style scoped>
.navbar {
    z-index:-1
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