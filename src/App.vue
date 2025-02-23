<script setup>
import { RouterView } from 'vue-router'
import MainNavigation from './components/MainNavigation.vue'
</script>

<template>
  <div class="app-container">
    <MainNavigation />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
