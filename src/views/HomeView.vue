<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
import UnderwaterBubbles from '@/components/UnderwaterBubbles.vue'

// 以 Vite 方式解析本地 Lottie 檔案 URL
const ballfishRollUrl = new URL('../assets/ballfish-roll.json', import.meta.url).href
</script>

<template>
  <UnderwaterBubbles />
  <main>
    <Vue3Lottie
      :animationLink="ballfishRollUrl"
      :width="240"
      :height="240"
      :loop="true"
      :autoPlay="true"
      :speed="1"
      direction="forward"
    />
    <TheWelcome />
  </main>
</template>
