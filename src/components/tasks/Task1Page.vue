<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useTimelineStepper from '@/composables/timelinestepper'
import useSmileStore from '@/stores/smiledata' // get access to the global store

const router = useRouter()
const route = useRoute()
const smilestore = useSmileStore()

const { stepNextRoute, stepPrevRoute } = useTimelineStepper()

if (route.meta.progress) smilestore.global.progress = route.meta.progress
const ntrials = ref(1)

// function finish(goto) {
//   // smilestore.saveData()
//   if (goto) router.push(goto)
// }
</script>

<template>
  <div class="page">
    <h1 class="title is-3">Task 1</h1>

    <div class="formcontent">
      <FormKit
        type="text"
        name="zipcode"
        label="Number of trials"
        placeholder="Enter zip or postal code"
        validation="optional"
        v-model="ntrials"
        help="How many trials do you want to do?"
      />

      <div class="formbutton">
        <button class="button is-success is-light" id="finish" @click="stepNextRoute()">
          next &nbsp;<FAIcon icon="fa-solid fa-arrow-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.formcontent {
  width: 25%;
  margin: auto;
  margin-bottom: 40px;
  padding-bottom: 200px;
  text-align: left;
}

.formbutton {
  margin-top: 1px solid #ccc;
  padding-top: 10px;
  text-align: right;
}
</style>
