<script setup>
import { routes } from '@/router' 



</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
        <div class="devmode-title">DEVELOPER MODE</div>
        <div class="devmode">
          --> [ Config: 
          <a href="/#/config" alt="View config">
            <fa-icon icon="fa-solid fa-gear" />
          </a>
        </div>
        <div class="devmode">
          Docs: 
          <a href="https://smile.gureckislab.org" alt="View docs" target="_new">
            <fa-icon icon="fa-solid fa-book" />
          </a>
        </div>
        <div class="devmode">
          <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              Jump to: 
              <a alt="Skip sections">
                <fa-icon icon="fa-solid fa-rainbow" />
              </a>
            </div>
            <div class="dropdown-menu" id="dropdown-menu" role="menu">
              <div class="dropdown-content">
                <a class="dropdown-item" v-for="r in routes" :href="'#'+r.path" >
                  <fa-icon icon="fa-solid fa-arrows-turn-to-dots" /> {{ r.name }}
                </a>
                <hr class="dropdown-divider">
              </div>
            </div>
          </div>
        </div>
        <div class="devmode">
          Data: 
          <a href="/#/data" alt="View config">
            <fa-icon icon="fa-solid fa-database" />
          </a>
          ]
        </div>
    </div>
        
  </nav>
</template>

<style scoped>
a {
  color: #fff;
}

.dropdown-content {
  border-radius: 0;
  padding-top:0;
  padding-bottom:0;
}

.dropdown-content b {
  color: #000;
  font-size: 13px;
}
.dropdown-divider {
  margin: 0;
}
.dropdown-item {
  color: #000;
  font-size: 13px;
  padding: 8px;
  margin: 0px;
  text-align: left;
}
a:hover {
  color: #10dffa;
}

.navbar {
  font-size: 13px;
  background: rgb(63, 160, 149);
  color: #fff;
  height: 5px;
  padding: 0px;
  padding-left: 10px;
  margin: 0px;
  min-height: 32px;
  text-align: center;
}

.devmode-title {
    padding-top: 8px;
  font-weight: 800;
  padding-left: 10px;
}
.devmode {
  padding-top: 8px;
  font-weight: 400;
  padding-left: 10px;
}
</style>