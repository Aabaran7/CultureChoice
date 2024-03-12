<script setup>
import { ref } from 'vue'
import useSmileStore from '@/stores/smiledata'
const smilestore = useSmileStore() // load the global store
const seed = ref(smilestore.getSeedID)

const showpanel = ref(false)

</script>
<template>
    <div class="dropdown is-hoverable is-right"
        :class="{ 'is-active': showpanel }">
        <div class=" dropdown-trigger">
            <button class="button is-success is-light dev-bar-button">
                <FAIcon icon=" fa-solid fa-dice" /> &nbsp; Randomize
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
                    <h1 class="title is-6">Seeded Randomization</h1>
                    </p>
                    <p class="is-left">
                        You have the option of manually setting the seed id,
                        which
                        is used to seed random number
                        generators throughout the experiment. To do so, replace
                        the value in the textbox with the desired
                        seed id and click the green reset button before
                        proceeding. Read more about randomization
                        <a
                            href="https://smile.gureckislab.org/randomization.html">in
                            the docs</a>.
                    </p>
                    <br />
                    <p class="is-right">
                    <div class="field">

                        <input id="switchRoundedDefault" type="checkbox"
                            name="switchRoundedDefault"
                            class="switch is-rounded is-rtl is-small"
                            v-model="smilestore.local.seedActive">
                        <label for="switchRoundedDefault"><b>Use fixed
                                seed</b>:</label>
                    </div>
                    </p>
                    <p class="is-right">
                        <b>Current seed value</b>:
                        <input class="input is-small" type="text"
                            placeholder="Current seed" size="25" width="20"
                            v-model="seed" />
                    </p>
                    <hr class="dropdown-divider mt-2 mb-2" />
                    &nbsp;
                    <button class="button is-success is-small" id="refresh"
                        @click="refresh()">
                        <FAIcon icon="fa-solid fa-arrow-rotate-left" />
                    </button>

                    <hr class="dropdown-divider" />
                    <p class="pb-2">
                    <h1 class="title is-6">Random variables</h1>
                    </p>
                    <p class="is-left">
                        Some text about this. Read more about randomization
                        <a
                            href="https://smile.gureckislab.org/randomization.html">
                            in the docs
                        </a>.
                    </p>
                    <br>
                    <template
                        v-for="(value, key) in smilestore.getPossibleConditions"
                        :key="key">
                        <b>{{ key }}</b>:
                        <div class="select is-small">
                            <select>
                                <option v-for="cond in value" :key="cond">
                                    {{ cond }}
                                </option>
                            </select>
                        </div>
                        <br><br>
                    </template>
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