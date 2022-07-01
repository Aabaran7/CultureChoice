<script setup>
import { ref, inject } from 'vue'
import useSmileStore from '@/stores/smiledata'
import { useRouter } from 'vue-router'

const smilestore = useSmileStore()
const router = useRouter()

defineProps({
  msg: String
})

const smileconfig = inject('smileconfig')
const count = ref(0)

function resetLocalState() {
  localStorage.removeItem(smileconfig.local_storage_key) // delete the local store
  smilestore.$reset()
  router.push('/')
}
</script>

<template>
  <section class="hero">
  <div class="hero-body">
    <p class="title">
      <span id="bigsmile">🤠</span>
    </p>
    <p class="subtitle ">
      <h1  class="title is-1">Smile!</h1>
    </p>
    <p>
      <h1 class="title is-4">A happy approach to online behavioral research.</h1>
    </p>
  </div>
</section>
  
  <div class="divider">Code Version Info</div>
  <div class="code">
    <ul>
      <li class="config" v-for="option, key in smileconfig.github" :key="key">
        <b>{{ key }}</b>: {{ option }}
      </li>
    </ul>
  </div>
  <br>
  <br>

  <div class="divider">Vue.js Reactivity Example</div>
  <b>Reactivity example:</b> <button   class="button is-success is-small is-light" type="button" @click="count++"><fa-icon icon="fa-solid fa-explosion" />&nbsp;Click me</button><br><br>
  
  <p>
  You've clicked the button {{ count }} times.
  </p>

  <p>
    Edit
    <code>components/pages/ConfigPage.vue</code> to test hot module replacement.
  </p>
  <div class="divider">Local State</div>
  <h4 class="title is-6">SmileData state:</h4>
  <button class="button is-warning is-small" @click="resetLocalState"><fa-icon icon="fa-solid fa-arrow-rotate-left" /> &nbsp; reset</button>
  <div class="code">
    <ul>
      <li class="config" v-for="option, key in smilestore.local" :key="key">
        <b>{{ key }}</b>: {{ option }}
      </li>
    </ul>
  </div>
  <br>
  <br>
  
  <br>
  <div class="divider">Configuration</div>
  <h4 class="title is-6">Smile Configuration Options:</h4>
  <div class="code">
  <ul>
    <li class="config" v-for="option, key in smileconfig" :key="key">
      <span v-if=" typeof(option)=='string' ">
        <b>{{key}}</b>: {{option}}
      </span>
      <span v-else>
        <b>{{key}}</b>: 
          <ul>
            <li v-for="option2,key2 in option" :key="key2">
              <b>{{key2}}</b>: {{option2}}
            </li>
          </ul>
      </span>

    </li>
    
  </ul>
</div>

</template>

<style scoped>
.hero {
  background-color: #79f2cc;
  margin-bottom: 0px;
}

.code {
  width: 600px;
  background: rgb(251, 251, 251);
  margin: auto;
  margin-top: 20px;
  padding: 10px;
}

.hero-body{
  padding-bottom: 0px;
  margin-butom: 0px;
}
a {
  color: #42b983;
}
.config {
  text-align: left;
  margin-left: 20px;
  font-family: monospace;
  font-size: 0.9em;
  font-weight: 500;
}

.config b {
  color: #639aa6;
}
#bigsmile {
  font-size: 100px;
}

</style>
