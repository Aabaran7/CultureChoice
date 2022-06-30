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

console.log(smileconfig);

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
  
  
  <div class="divider">Vue.js Reactivity Example</div>
  <b>Reactivity example:</b> <button   class="button is-success is-small is-light" type="button" @click="count++">Click me</button><br><br>
  
  <p>
  You've clicked the button {{ count }} times.
  </p>

  <p>
    Edit
    <code>components/pages/ConfigPage.vue</code> to test hot module replacement.
  </p>
  <div class="divider">Local State</div>
  <h4>SmileData state:</h4>
  <code>
    {{ smilestore.local }}
  </code>
  <br>
  <br>
  <button class="button is-warning is-small" @click="resetLocalState">reset</button>
  <br>
  <div class="divider">Configuration</div>
  <h4>Smile Configuration Options:</h4>
  <ul>
    <li class="config" v-for="option, key in smileconfig" :key="key">
      <span v-if=" typeof(option)=='string' ">
        <code><b>{{key}}</b>: {{option}}</code>
      </span>
      <span v-else>
        <code><b>{{key}}</b></code>: 
          <ul>
            <li v-for="option2,key2 in option" :key="key2">
              <code><b>{{key2}}</b>: {{option2}}</code>
            </li>
          </ul>
      </span>

    </li>
  </ul>


</template>

<style scoped>
.hero {
  background-color: #79f2cc;
  margin-bottom: 0px;
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
}
#bigsmile {
  font-size: 100px;
}

</style>
