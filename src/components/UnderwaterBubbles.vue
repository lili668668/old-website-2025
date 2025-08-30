<template>
  <div class="underwater-background">
    <div
      v-for="bubble in bubbles"
      :key="bubble.id"
      class="bubble"
      :style="{
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
        left: `${bubble.left}vw`,
        animationDuration: `${bubble.duration}s`,
        animationDelay: `${bubble.delay}s`,
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const bubbles = ref([]);
const numBubbles = 30; // Create 30 bubbles

onMounted(() => {
  const newBubbles = [];
  for (let i = 0; i < numBubbles; i++) {
    newBubbles.push({
      id: i,
      size: 10 + Math.random() * 50, // Bubble size between 10px and 60px
      left: Math.random() * 100, // Horizontal position in vw
      duration: 8 + Math.random() * 12, // Animation duration between 8s and 20s
      delay: Math.random() * 10, // Animation delay up to 10s
    });
  }
  bubbles.value = newBubbles;
});
</script>

<style scoped>
.underwater-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to top, #1A2980, #26D0CE); /* Deep sea to light blue gradient */
  z-index: -1; /* Place it behind all other content */
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: -100px; /* Start from below the viewport */
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
  animation-name: rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes rise {
  0% {
    transform: translateY(0);
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120vh); /* Ensure it goes well above the viewport */
    opacity: 0;
  }
}
</style>
