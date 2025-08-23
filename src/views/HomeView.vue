<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main>
    <Vue3Lottie
      animationLink="https://assets2.lottiefiles.com/packages/lf20_GbabwrUY2k.json"
      :height="200"
      :width="200"
    />
    <TheWelcome />
  </main>
</template>
