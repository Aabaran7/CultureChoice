<script setup>
import { ref } from 'vue'
import useSmileStore from '@/stores/smiledata'
const smilestore = useSmileStore() // load the global store

const showpanel = ref(false)

</script>
<template>
    <div class="dropdown is-hoverable is-right"
        :class="{ 'is-active': showpanel }">
        <div class=" dropdown-trigger">
            <button class="button is-success is-light dev-bar-button">
                <FAIcon icon=" fa-solid fa-hand" /> 
            </button>
        </div>
        <div class="dropdown-menu pt-0 mt-0" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <div class="pin" :class="{ 'pin-selected': showpanel }">
                    <a @click="showpanel = !showpanel">
                        <FAIcon icon=" fa-solid fa-thumbtack" />
                    </a>
                </div>
                <div class="randomization is-right">
                    <p class="pb-2">
                    <h1 class="title is-6">Manipulate State</h1>
                    </p>
                    <p class="is-left">
                        You can override or view certain user-relevant state
                        variables for testing purposes.
                    </p>
                    <br />
                    <div class="columns">
                        <div class="column is-6">
                            <div class="field">
                            <input id="switchRoundedDefault1" type="checkbox"
                                name="switchRoundedDefault1"
                                class="switch is-rounded is-rtl is-small"
                                v-model="smilestore.local.knownUser">
                            <label for="switchRoundedDefault1"><b>Is known</b>:</label>
                            </div>
                            <div class="field">
                                <input id="switchRoundedDefault2" type="checkbox"
                                    name="switchRoundedDefault2"
                                    class="switch is-rounded is-rtl is-small"
                                    v-model="smilestore.data.done">
                                <label for="switchRoundedDefault2"><b>Is done</b>:</label>
                            </div>
                        </div>
                        <div class="column is-6">
                            <div class="field">
                            <input id="switchRoundedDefault3" type="checkbox"
                                name="switchRoundedDefault3"
                                class="switch is-rounded is-rtl is-small"
                                v-model="smilestore.data.consented">
                            <label for="switchRoundedDefault3"><b>Has consented</b>:</label>
                            </div>
                            <div class="field">
                                <input id="switchRoundedDefault4" type="checkbox"
                                    name="switchRoundedDefault4"
                                    class="switch is-rounded is-rtl is-small"
                                    v-model="smilestore.data.withdraw">
                                <label for="switchRoundedDefault4"><b>Withdrew</b>:</label>
                            </div>
                        </div>
                    </div>
                    
                   
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.pin {
    float: right;
    margin: 0;
    padding-right: 15px;
    color: #fff;
}

.pin a {
    color: #ccc;
}

.pin-selected a {
    color: #42b983;
}

.randomization {
    width: 350px;
    padding: 15px;
    text-align: left;
}

.randomization a {
    color: #0b8a9b;
}
</style>