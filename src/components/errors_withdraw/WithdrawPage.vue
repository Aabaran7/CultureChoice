<script setup>
import { useRoute } from 'vue-router'
import useSmileStore from '@/stores/smiledata' // get access to the global store

const route = useRoute()
const smilestore = useSmileStore()

if (route.meta.progress) smilestore.global.progress = route.meta.progress

smilestore.saveData(true) // force a data save
</script>

<template>
  <div class="page">
    <div class="withdraw" v-if="smilestore.recruitmentService == 'prolific'">
      <h1 class="title is-3 has-text-danger">You have successfully withdrawn from the study.</h1>
      <article class="message is-danger" v-if="smilestore.data.withdraw">
        <div class="message-header">
          <p>Notice about withdraw</p>
        </div>
        <div class="message-body has-text-left">
          You have indicated that you withdrew from the study. Please return the task and we will contact you for
          partial payment if you are eligible.
        </div>
      </article>
    </div>

    <div class="withdraw" v-if="smilestore.recruitmentService == 'cloudresearch'">
      <h1 class="title is-3 has-text-danger">You have successfully withdrawn from the study.</h1>
      <article class="message is-danger" v-if="smilestore.data.withdraw">
        <div class="message-header">
          <p>Notice about withdraw</p>
        </div>
        <div class="message-body has-text-left">
          You have indicated that you withdrew from the study. Please return the task and we will contact you for
          partial payment if you are eligible.
        </div>
      </article>
    </div>

    <div class="withdraw" v-if="smilestore.recruitmentService == 'mturk'">
      <h1 class="title is-3 has-text-danger">You have successfully withdrawn from the study.</h1>
      <article class="message is-danger" v-if="smilestore.data.withdraw">
        <div class="message-header">
          <p>Notice about withdraw</p>
        </div>
        <div class="message-body has-text-left">
          You have indicated that you withdrew from the study. Please return the task and we will contact you for
          partial payment if you are eligible.
        </div>
      </article>
    </div>

    <div class="withdraw" v-if="smilestore.recruitmentService == 'citizensci'">
      <h1 class="title is-3 has-text-danger">You have successfully withdrawn from the study.</h1>
      <article class="message is-danger" v-if="smilestore.data.withdraw">
        <div class="message-header">
          <p>Notice about withdraw</p>
        </div>
        <div class="message-body has-text-left">
          You have indicated that you withdrew from the study. Please return the task and we will contact you for
          partial payment if you are eligible.
        </div>
      </article>
    </div>

    <div class="withdraw" v-if="smilestore.recruitmentService == 'web'">
      <h1 class="title is-3 has-text-danger">You have successfully withdrawn from the study.</h1>
    </div>
  </div>
</template>

<style scoped>
.withdraw {
  width: 60%;
  margin: auto;
}
</style>
