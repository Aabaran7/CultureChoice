<script setup>
import { ref, reactive } from 'vue'
import useSmileStore from '@/stores/smiledata'
const smilestore = useSmileStore() // load the global store
const seed = ref(smilestore.getSeedID)

const panel = ref('local')
const showpanel = ref(false)

function createLink(option) {
    if (typeof (option) === 'string') {
        if (option.slice(0, 4) === 'http') {
            return `<a href='${option}' target='_new'>${option}</a>`
        }
    }
    return String(option)
}

</script>
<template>
    <div class="dropdown is-hoverable is-right"
        :class="{ 'is-active': showpanel }">
        <div class=" dropdown-trigger">
            <button class="button is-success is-light dev-bar-button">
                <FAIcon icon="fa-solid fa-gear" /> 
            </button>
        </div>
        <div class="dropdown-menu pt-0 mt-0" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
                <div class="pin" :class="{ 'pin-selected': showpanel }">
                    <a @click="showpanel = !showpanel">
                        <FAIcon icon=" fa-solid fa-thumbtack" />
                    </a>
                </div>
                <div class="datapanel has-text-left">
                    <p class="pb-2">
                    <h1 class="title is-6">Configuration</h1>
                    </p>
                    <p class="is-left">
                        Welcome to the configuration page for your project. This
                        page can help you understand the application state. Read
                        more about configuration options
                        <a
                            href="https://smile.gureckislab.org/configuration.html">in
                            the docs</a>.
                    </p>
                    <br />
                    <div class="tabs is-small is-centered">
                        <ul>
                            <li :class="{ 'is-active': panel == 'local' }">
                                <a @click="panel = 'local'"><b>
                                    Local
                                        State
                                </b></a>
                            </li>
                            <li :class="{ 'is-active': panel == 'code' }">
                                <a @click="panel = 'code'"><b>
                                    Code
                                        Version
                                </b></a>
                            </li>
                            <li :class="{ 'is-active': panel == 'full' }">
                                <a @click="panel = 'full'"><b>Full Config</b></a>
                            </li>
                        </ul>
                    </div>
                    <div class="datapanel" v-if="panel == 'local'">
                        <div class="code">
                            <ul>
                                <li class="config"
                                    v-for="option, key in smilestore.local"
                                    :key="key">
                                    <span
                                        v-if="(typeof (option) != 'object') || option === undefined || option === null">
                                        <b>{{ key }}</b>: <span
                                            v-html='createLink(option)'></span>
                                    </span>
                                    <span v-else>
                                        <b>{{ key }}</b>:
                                        <ul>
                                            <li v-for="option2, key2 in option"
                                                :key="key2">
                                                <b>{{ key2 }}</b>: <span
                                                    v-html='createLink(option2)'></span>
                                            </li>
                                        </ul>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="configinfo" v-if="panel == 'code'">
                        <div class="datapanel">
                            <div class="code">
                                <ul>
                                    <li class="config"
                                        v-for="option, key in smilestore.config.github"
                                        :key="key">
                                        <b>{{ key }}</b>: <span
                                            v-html='createLink(option)'></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="configinfo" v-if="panel == 'full'">
                        <div class="datapanel">
                            <div class="code">
                                <ul>
                                    <li class="config"
                                        v-for="option, key in smilestore.config"
                                        :key="key">
                                        <span
                                            v-if="typeof (option) == 'string'">
                                            <b>{{ key }}</b>: <span
                                                v-html='createLink(option)'></span>
                                        </span>
                                        <span v-else>
                                            <b>{{ key }}</b>:
                                            <ul>
                                                <li v-for="option2, key2 in option"
                                                    :key="key2">
                                                    <b>{{ key2 }}</b>: <span
                                                        v-html='createLink(option2)'></span>
                                                </li>
                                            </ul>
                                        </span>
                                    </li>
                                </ul>
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

.datapanel {
    padding: 15px;
    text-align: left;
    width: 500px;
}

a {
    color: #42b983;
}

.tabs {
    margin-bottom: 0px;
}

.config {
    text-align: left;
    margin-left: 20px;
    font-family: monospace;
    font-size: 0.9em;
    font-weight: 500;
}

.config a {
    color: #0b8a9b;
}

.config b {
    color: #639aa6;
}

.code {
    background: rgb(251, 251, 251);
    margin: auto;
    margin-top: 0px;
    margin-right: 25px;
    padding: 10px;
    word-wrap: break-word;
}

.code p {
    text-align: left;
    font-size: 0.9em;
}
</style>