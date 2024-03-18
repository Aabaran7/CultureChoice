<script setup>
//import { useTimeAgo } from '@vueuse/core'

import SmileAPI from '@/core/composables/smileapi'
const api = SmileAPI()
</script>
<template>

  <!-- content of panel here -->
  <div class="contentpanel">
    <div class="columns colcontent">
      <div class="column is-2 edge">
        <h2 class="is-size-6 has-text-info"><FAIcon icon="fa-solid fa-eye" />&nbsp;&nbsp;Status</h2>
        <p class="is-size-4 has-text-left pt-3">
          <FAIcon icon="fa-solid fa-user-minus" class="disconnected" :class="{ connected: api.local.knownUser }" />&nbsp;&nbsp;<span class="is-size-7">user known</span><br>
          <FAIcon icon="fa-solid fa-circle" class="disconnected" :class="{ connected: api.global.db_connected }"/>&nbsp;&nbsp;<span class="is-size-7">db connected</span><br>
          <FAIcon icon="fa-solid fa-circle-dot" class="warning" :class="{ disconnected: api.global.db_changes }"/>&nbsp;&nbsp;<span class="is-size-7">synced</span><br>
          <!--
          <b>The user current appear unknown.:</b> {{ api.local.knownUser }}<br />
          <b>There are changes to the data since last write:</b> {{ api.local.knownUser }}<br />
          <b>The database is disconnected:</b> {{ api.global.db_connected }}<br />
          -->
          <hr class="divider">
        </p>
        <p class="is-size-7 has-text-left">
          <b>docRef:</b> {{ api.local.docRef }}<br />
          <b>partNum:</b> {{ api.local.partNum }}<br />
          <b>mode:</b> {{ api.config.mode == 'development'? 'testing':'live' }}<br />
        </p>
      </div>
      <div class="column is-2 edge isdark">
        <h2 class="is-size-6 has-text-success"><FAIcon icon="fa-solid fa-pencil" />&nbsp;&nbsp;Database Writes</h2>

        <p class="has-text-centered">
          <span class="is-size-1">
            {{ api.local.totalWrites }}
          </span>
          writes <br />
          <span class="is-size-6">out of {{ api.config.max_writes }} max</span>
          <br />
        </p>
        <hr class="divider" />
        <span class="is-size-7">Last was {{ Date.now() - api.local.lastWrite }} seconds ago.</span>
      </div>

      <div class="column is-8 edge islight">
        <h2 class="is-size-6 has-text-warning"><FAIcon icon="fa-solid fa-chart-line" />&nbsp;&nbsp;Graphs</h2>
      </div>
    </div>
  </div>

</template>

<style scoped>
.connected {
  color: #00c42e;
}
.warning {
  color: #d5d808;
}
.disconnected {
  color: #f60909;
}
.connected {
  color: #00d1b2;
}
.divider {
  border: 0.1px solid;
  margin: 10px 0;
}
.bignumber {
  font-size: 5em;
  padding: 0;
}
.contentpanel {
  padding-left: 20px;
  height: 100%;

}
.isdark {
  background: #414141;
  color: #fff;
}
.islight {
  background: #828282;
  color: #fff;
}
.islighter {
  background: #b0adad;
  color: #fff;
}
.colcontent {
  height: 100%;
  user-select: none;
}
.edge {
  border-right: 1px solid #010101;
  padding-top: 20px;
}
</style>
