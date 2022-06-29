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
  <span id="bigsmile">🫠</span>
  <h1>{{ msg }}</h1>
  <h3>A happy approach to online behavioral research.</h3>

  Reactivity example: <button type="button" @click="count++">Click me</button><br>
  You've clicked the button {{ count }} times.

  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <hr>
  <h4>SmileData state</h4>
  <code>
    {{ smilestore.local }}
  </code>
  <button @click=resetLocalState>reset local store</button>
  <br><br>
  <code>
    {{ smilestore.data }}
  </code>
  <hr>
  <h4>Smile Configuration Options:</h4>

  <code>
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
  </code>

</template>

<style scoped>
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
