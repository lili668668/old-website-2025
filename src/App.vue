<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const menuItems = [
  {
    name: 'Home',
    path: '/',
    description: '旅程的起點。返回主要畫面。'
  },
  {
    name: 'About',
    path: '/about',
    description: '關於這個世界的創造者。'
  }
]

const hoveredItemDescription = ref('將游標移至選項上以查看說明。')

function showDescription(description: string) {
  hoveredItemDescription.value = description
}

function resetDescription() {
  hoveredItemDescription.value = '將游標移至選項上以查看說明。'
}
</script>

<template>
  <main class="rpg-ui">
    <h1 class="title">BALLFISH-WEBSITE-2025</h1>

    <div class="menu-container">
      <nav class="character-select">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          :to="item.path"
          class="menu-item"
          @mouseover="showDescription(item.description)"
          @mouseleave="resetDescription"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <div class="description-box">
        <p>{{ hoveredItemDescription }}</p>
      </div>
    </div>

    <div class="content-view">
      <RouterView />
    </div>
  </main>
</template>

<style scoped>
.rpg-ui {
  border: 4px solid var(--border-color);
  box-shadow: 0 0 10px var(--border-color);
  padding: 2rem;
  width: 100%;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.title {
  font-size: 1.5rem;
  color: var(--accent-color);
  text-shadow: 2px 2px #000000;
  margin-bottom: 2rem;
}

.menu-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.character-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
}

.menu-item {
  position: relative;
  padding: 0.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
}

.menu-item:hover,
.menu-item.router-link-exact-active {
  color: var(--accent-color);
}

.menu-item:hover::before,
.menu-item.router-link-exact-active::before {
  content: '>';
  position: absolute;
  left: -20px;
  color: var(--accent-color);
  animation: blink 1s infinite;
}

.description-box {
  border: 2px solid var(--border-color);
  padding: 1rem;
  min-height: 60px;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #ccc;
}

.content-view {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px dashed var(--border-color);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
