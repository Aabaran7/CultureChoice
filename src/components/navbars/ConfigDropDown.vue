<script setup>
import { ref, reactive } from 'vue'
import useSmileStore from '@/core/stores/smiledata'
const smilestore = useSmileStore() // load the global store
const seed = ref(smilestore.getSeedID)

const panel = reactive({ type: 'local', visible: false, x: -280, y: 0 })

function toggle_and_reset() {
  panel.visible = !panel.visible
  if (panel.visible == false) {
    panel.x = -280
    panel.y = 0
  }
}
function onDragCallback(x, y) {
  panel.x = x
  panel.y = y
}

function createLink(option) {
  if (typeof option === 'string') {
    if (option.slice(0, 4) === 'http') {
      return `<a href='${option}' target='_new'>${option}</a>`
    }
  }
  return String(option)
}
</script>
<template>
  <div class="dropdown is-hoverable is-right" :class="{ 'is-active': panel.visible }">
    <div class="dropdown-trigger">
      <button class="button is-success is-light dev-bar-button">
        <FAIcon icon="fa-solid fa-gear" />
      </button>
    </div>
    <div class="dropdown-menu pt-0 mt-0" id="dropdown-menu" role="menu">
      <vue-draggable-resizable
        :x="panel.x"
        :y="panel.y"
        :draggable="panel.visible"
        :resizable="false"
        :onDrag="onDragCallback"
      >
        <div class="dropdown-content">
          <div class="pin" :class="{ 'pin-selected': panel.visible }">
            <a @click="toggle_and_reset()">
              <FAIcon icon=" fa-solid fa-thumbtack" />
            </a>
          </div>
          <div class="datapanel has-text-left">
            <h1 class="title is-6">Configuration</h1>
            <p class="is-left">
              Welcome to the configuration page for your project. This page can help you understand the application
              state. Read more about configuration options
              <a href="https://smile.gureckislab.org/configuration.html">in the docs</a>.
            </p>
            <br />
            <div class="tabs is-small is-centered">
              <ul>
                <li :class="{ 'is-active': panel.type == 'local' }">
                  <a @click="panel.type = 'local'"><b> Local State </b></a>
                </li>
                <li :class="{ 'is-active': panel.type == 'code' }">
                  <a @click="panel.type = 'code'"><b> Code Version </b></a>
                </li>
                <li :class="{ 'is-active': panel.type == 'full' }">
                  <a @click="panel.type = 'full'"><b>Full Config</b></a>
                </li>
              </ul>
            </div>
            <div class="datapanel" v-if="panel.type == 'local'">
              <div class="code">
                <ul>
                  <li class="config" v-for="(option, key) in smilestore.local" :key="key">
                    <span v-if="typeof option != 'object' || option === undefined || option === null">
                      <b>{{ key }}</b
                      >: <span v-html="createLink(option)"></span>
                    </span>
                    <span v-else>
                      <b>{{ key }}</b
                      >:
                      <ul>
                        <li v-for="(option2, key2) in option" :key="key2">
                          <b>{{ key2 }}</b
                          >: <span v-html="createLink(option2)"></span>
                        </li>
                      </ul>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="configinfo" v-if="panel.type == 'code'">
              <div class="datapanel">
                <div class="code">
                  <ul>
                    <li class="config" v-for="(option, key) in smilestore.config.github" :key="key">
                      <b>{{ key }}</b
                      >: <span v-html="createLink(option)"></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="configinfo" v-if="panel.type == 'full'">
              <div class="datapanel">
                <div class="code">
                  <ul>
                    <li class="config" v-for="(option, key) in smilestore.config" :key="key">
                      <span v-if="typeof option == 'string'">
                        <b>{{ key }}</b
                        >: <span v-html="createLink(option)"></span>
                      </span>
                      <span v-else>
                        <b>{{ key }}</b
                        >:
                        <ul>
                          <li v-for="(option2, key2) in option" :key="key2">
                            <b>{{ key2 }}</b
                            >: <span v-html="createLink(option2)"></span>
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
      </vue-draggable-resizable>
    </div>
  </div>
</template>

<style scoped>
.dropdown-content {
  padding: 0;
  padding-top: 8px;
  margin: 0;
  width: 500px;
  text-align: left;
}

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
