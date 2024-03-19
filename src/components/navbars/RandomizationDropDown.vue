<script setup>
import { ref, reactive } from 'vue'
import useSmileAPI from '@/core/composables/smileapi'
const api = useSmileAPI()
import useSmileStore from '@/core/stores/smiledata'
const smilestore = useSmileStore() // load the global store
const seed = ref(smilestore.getSeedID)

function toggle_and_reset() {
  api.dev.randomization_panel.visible = !api.dev.randomization_panel.visible
  if (api.dev.randomization_panel.visible == false) {
    api.dev.randomization_panel.x = -130
    api.dev.randomization_panel.y = 0
  }
}

function onDragCallback(x, y) {
  api.dev.randomization_panel.x = x
  api.dev.randomization_panel.y = y
}
</script>
<template>
  <div class="dropdown is-hoverable is-right" :class="{ 'is-active': api.dev.randomization_panel.visible }">
    <div class="dropdown-trigger">
      <button class="button is-success is-light dev-bar-button">
        <FAIcon icon=" fa-solid fa-dice" />
      </button>
    </div>

    <div class="dropdown-menu pt-0 mt-0" id="dropdown-menu" role="menu">
      <vue-draggable-resizable
        :x="api.dev.randomization_panel.x"
        :y="api.dev.randomization_panel.y"
        :draggable="api.dev.randomization_panel.visible"
        :resizable="false"
        :onDrag="onDragCallback"
      >
        <div class="dropdown-content">
          <div class="pin" :class="{ 'pin-selected': api.dev.randomization_panel.visible }">
            <a @click="toggle_and_reset()">
              <FAIcon icon=" fa-solid fa-thumbtack" />
            </a>
          </div>
          <div class="randomization is-right">
            <h1 class="title is-6">Seeded Randomization</h1>
            <p class="is-left">
              You have the option of manually setting the seed id, which is used to seed random number generators
              throughout the experiment. To do so, replace the value in the textbox with the desired seed id and click
              the green reset button before proceeding. Read more about randomization
              <a href="https://smile.gureckislab.org/randomization.html">in the docs</a>.
            </p>
            <br />
            <div class="field">
              <input
                id="switchRoundedDefault"
                type="checkbox"
                name="switchRoundedDefault"
                class="switch is-rounded is-rtl is-small"
                v-model="smilestore.local.seedActive"
              />
              <label for="switchRoundedDefault"><b>Use fixed seed</b>:</label>
            </div>
            <div class="field">
              <input
                class="input is-small"
                type="text"
                placeholder="Current seed"
                size="15"
                width="10"
                v-model="seed"
              />
              <button class="button is-success is-small" id="refresh" @click="refresh()">
                <FAIcon icon="fa-solid fa-arrow-rotate-left" />
              </button>
            </div>

            <hr class="dropdown-divider mt-2 mb-2" />
            &nbsp;

            <hr class="dropdown-divider" />
            <h1 class="title is-6">Random variables</h1>
            <p class="is-left">
              Some text about this. Read more about randomization
              <a href="https://smile.gureckislab.org/randomization.html"> in the docs </a>.
            </p>
            <br />
            <template v-for="(value, key) in smilestore.getPossibleConditions" :key="key">
              <b>{{ key }}</b
              >:
              <div class="select is-small">
                <select>
                  <option v-for="cond in value" :key="cond">
                    {{ cond }}
                  </option>
                </select>
              </div>
              <br /><br />
            </template>
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
  width: 350px;
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

.randomization {
  width: 350px;
  padding: 15px;
  text-align: left;
}

.randomization a {
  color: #0b8a9b;
}
</style>
