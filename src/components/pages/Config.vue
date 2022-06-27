<script setup>
import { useSmileStore } from '@/stores/smiledata'
import { ref } from 'vue'

const smilestore = useSmileStore()

defineProps({
  msg: String
})

const count = ref(0)

</script>

<template>
  <span id="bigsmile">🫠</span>
  <h1>{{ msg }}</h1>
  <h3>A happy approach to online behavioral research.</h3>

  Reactivity example: <button type="button" @click="smilestore.d.counter++">Click me</button><br>
  You've clicked the button {{ smilestore.d.counter }} times.

  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <hr>
  <h4>SmileData state</h4>
  <code>
    {{ smilestore.d }}
  </code>
  <hr>
  <h4>Smile Configuration Options:</h4>

  <code>
  <ul>
    <li class="config" v-for="option, key in smileconfig">
      <span v-if=" typeof(option)=='string' ">
        <b>{{key}}</b>: {{option}}
      </span>
      <span v-else>
        <b>{{key}}</b>: 
          <ul>
            <li v-for="option2,key2 in option">
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
