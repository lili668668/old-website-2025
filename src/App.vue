<template>
  <main class="rpg-ui">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.rpg-ui {
  border: 4px solid var(--border-color);
  box-shadow: 0 0 10px var(--border-color);
  padding: 2rem;
  width: 100%;
  text-align: center;
}
</style>
