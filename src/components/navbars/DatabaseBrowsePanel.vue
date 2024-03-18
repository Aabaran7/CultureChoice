<script setup>
import SmileAPI from '@/core/composables/smileapi'
const api = SmileAPI()
</script>
<template>
  <!-- content of panel here -->
  <div class="contentpanel">
    <!-- content of panel here -->
    <div class="contentpanel">
      <div class="columns colcontent">
        <div class="column is-2 edge"></div>
        <div class="column is-2 edge isdark"></div>
        <div class="column is-8 edge islight"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contentpanel {
  padding-left: 20px;
}
.colcontent {
  height: 100%;
}
.edge {
  border-right: 1px solid #010101;
  padding-top: 20px;
}
</style>
