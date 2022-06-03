<script setup>
import { ref } from 'vue'

defineProps({
  msg: String
})

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <h3>A happy approach to online behavioral research.</h3>

  Reactivity example: <button type="button" @click="count++">Click me</button><br>
  You've clicked the button {{ count }} times.

  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <hr>
  <h4>Smile Configuration Options:</h4>

  <code>
  <li class="config" v-for="option, key in smileconfig">
    <b>{{key}}</b> : {{option}}
  </li>
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
</style>
