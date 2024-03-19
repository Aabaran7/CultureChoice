<script setup>
//import { useTimeAgo } from '@vueuse/core'

import SmileAPI from '@/core/composables/smileapi'
const api = SmileAPI()
</script>
<template>
  <!-- content of panel here -->
  <div class="contentpanel">
    <div class="columns colcontent">
      <div class="column is-2 edge pr-0">
        <div class="columnheader"><FAIcon icon="fa-solid fa-eye" />&nbsp;&nbsp;Status</div>
        <div class="columncontent">
          <div class="statusinfo">
            <template v-if="api.local.knownUser">
              <FAIcon
                icon="fa-solid fa-user-plus"
                class="disconnected"
                :class="{ connected: api.local.knownUser }"
              />&nbsp;&nbsp;<span class="is-size-7">user known</span><br />
            </template>
            <template v-else>
              <FAIcon
                icon="fa-solid fa-user-minus"
                class="disconnected"
                :class="{ connected: api.local.knownUser }"
              />&nbsp;&nbsp;<span class="is-size-7">user known</span><br />
            </template>

            <FAIcon
              icon="fa-solid fa-database"
              class="disconnected"
              :class="{ connected: api.global.db_connected }"
            />&nbsp;&nbsp;<span class="is-size-7">db connected</span><br />
            <FAIcon
              icon="fa-solid fa-rotate"
              class="warning"
              :class="{ disconnected: api.global.db_changes }"
            />&nbsp;&nbsp;<span class="is-size-7">synced</span><br />
            <!--
          <b>The user current appear unknown.:</b> {{ api.local.knownUser }}<br />
          <b>There are changes to the data since last write:</b> {{ api.local.knownUser }}<br />
          <b>The database is disconnected:</b> {{ api.global.db_connected }}<br />
          --></div>
          <hr />

          <p class="is-size-7 has-text-left">
            <b>docRef:</b> {{ api.local.docRef }}<br />
            <b>partNum:</b> {{ api.local.partNum }}<br />
            <b>mode:</b> {{ api.config.mode == 'development' ? 'testing' : 'live' }}<br />
          </p>
        </div>
      </div>
      <div class="column is-2 edge pl-0 pr-0">
        <div class="columnheader"><FAIcon icon="fa-solid fa-pencil" />&nbsp;&nbsp;Database Writes</div>
        <div class="columncontent">
          <div class="statusinfo">
            <p class="has-text-centered">
              <span class="is-size-1">
                {{ api.local.totalWrites }}
              </span>
              writes <br />
              <span class="is-size-6">out of {{ api.config.max_writes }} max</span>
              <br />
            </p>
            <span class="is-size-7">Last was {{ Date.now() - api.local.lastWrite }} seconds ago.</span>
          </div>
          <br />
          <p class="pl-10 pr-10 mb-10">
            Firebase limits document writes to 1 per second. The Smile API limits writes to a few per second to prevent
            runaway writes. Also there is a maximum number of writes given to each application.
          </p>
        </div>
      </div>

      <div class="column is-8 edge pl-0 pr-0">
        <div class="columnheader"><FAIcon icon="fa-solid fa-chart-line" />&nbsp;&nbsp;Graphs</div>
        <div class="columncontent">stuff here</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statusinfo {
  padding: 10px;
  font-size: 2em;
  border: 1px solid #d5d5d5;
  border-radius: 0.8em;
  background-color: #f7f7f7;
}
.columncontent {
  padding: 10px;
  font-size: 0.8em;
}
.columncontent hr {
  padding: 0px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.columnheader {
  background: #f4f4f4;
  padding: 5px;
  font-size: 0.8em;
  margin-bottom: 10px;
  padding-left: 10px;
}
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
  padding-left: 0px;
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
  border-right: 1px solid #e9e9e9;
  margin: 0px;
}
</style>
