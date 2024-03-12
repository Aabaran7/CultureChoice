<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useSmileStore from '@/stores/smiledata'
import appconfig from '@/config'

const smilestore = useSmileStore()
const router = useRouter()

defineProps({
  msg: String
})

smilestore.global.page_bg_color = '#fff'
smilestore.global.page_text_color = '#000'
smilestore.global.status_bar_bg_color = '#fff'
smilestore.global.status_bar_text_color = '#000'

const count = ref(0)

function createLink(option) {
  if (typeof (option) === 'string') {
    if (option.slice(0, 4) === 'http') {
      return `<a href='${option}' target='_new'>${option}</a>`
    }
  }
  return String(option)
}
function resetLocalState() {
  localStorage.removeItem(smilestore.config.local_storage_key) // delete the local store
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_id`)
  // localStorage.removeItem(`${appconfig.local_storage_key}-seed_set`)
  smilestore.$reset()  // reset all the data even

  // go back to the landing page (don't use router because it won't refresh the page and thus won't reset the app)
  const url = window.location.href
  window.location.href = url.substring(0, url.lastIndexOf('#/'))
}
</script>

<template>
  <section class="hero">
    <div class="hero-body">
      <p class="title">
        <span id="bigsmile">🤠</span>
      </p>
      <p class="subtitle">
      <h1 class="title is-1">Check out your beautiful data!</h1>
      </p>
    </div>
  </section>

  <div class="columns">

    <div class="column is-3">

      <div class="code">
        <p>This page can help you debug issues with your data files.</p>
      </div>


    </div>

    <div class="column is-9">

      <div class="divider">Data</div>
      <div class="code">
        <ul>
          <li class="config" v-for="option, key in smilestore.data" :key="key">
            {{ typeof (option) }}
            {{ key }}
            {{ option }}

            <span
              v-if="typeof (option) == 'string' || option === undefined || option === null">
              <b>{{ key }}</b>: <span v-html='createLink(option)'></span>
            </span>
            <span v-else-if="key !== 'smile_config'">
              <b>{{ key }}</b>:
              <ul>
                <li v-for="option2, key2 in option" :key="key2">
                  <b>{{ key2 }}</b>: <span v-html='createLink(option2)'></span>
                </li>
              </ul>
            </span>
          </li>
        </ul>
      </div>
      <br>
      <br>
    </div>
  </div>










</template>

<style scoped>
.hero {
  background-color: #79f2cc;
  margin-bottom: 0px;
}

.columns {
  padding-left: 30px;
  padding-right: 30px;
  margin-bottom: 30px;
}

.code {
  background: rgb(251, 251, 251);
  margin: auto;
  margin-top: 20px;
  padding: 10px;
  word-wrap: break-word;
}

.code p {
  text-align: left;
  font-size: 0.9em;
}

.hero-body {
  padding-bottom: 0px;
  margin-bottom: 0px;
}

a {
  color: #42b983;
}

.config {
  text-align: left;
  margin-left: 20px;
  font-family: monospace;
  font-size: 0.8em;
  font-weight: 500;
}

.config b {
  color: #639aa6;
}

#bigsmile {
  font-size: 100px;
}
</style>
