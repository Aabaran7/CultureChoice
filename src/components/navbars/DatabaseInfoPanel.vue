<script setup>
import SmileAPI from '@/core/composables/smileapi'
const api = SmileAPI()
</script>
<template>
  <!-- content of panel here -->
  <div class="contentpanel">
    <div class="columns colcontent">
      <div class="column is-3 edge">
        <b>knownUser:</b> {{ api.local.knownUser }}<br />
        <b>dbConnected:</b> {{ api.global.db_connected }}<br />
        <b>docRef:</b> {{ api.local.docRef }}<br />
        <b>partNum:</b> {{ api.local.partNum }}<br />
        <b>totalWrites:</b> {{ api.local.totalWrites }}<br />
        <b>lastWrites:</b> {{ api.local.lastWrite }}<br />
      </div>
      <div class="column is-3 edge">hi</div>
      <div class="column is-3 edge">hi</div>
      <div class="column is-3">hi</div>
    </div>
  </div>
</template>

<style scoped>
.contentpanel {
  padding-left: 20px;
  height: 100%;
}
.colcontent {
  height: 100%;
}
.edge {
  border-right: 1px solid #ccc;
  padding-top: 30px;
}
</style>
