<template>
  <div :class="$style.container">
    <div class="output">
      <p :class="$style.line">Select your language:</p>
      <router-link
        v-for="(item, index) in languages"
        :key="item.lang"
        :class="$style.option"
        :to="`/${item.lang}`"
        @mouseenter="selectedIndex = index"
      >
        <span :class="$style.cursor">{{ index === selectedIndex ? '>' : ' ' }}</span>
        <span :class="$style.key">[{{ item.key }}]</span>
        <span :class="$style.label">{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Lang } from '../constants/Lang'
import { RouterLink } from 'vue-router'
import { useNavigationStore } from '../stores/navigation'

const router = useRouter()
const navigationStore = useNavigationStore()
const selectedIndex = ref(0)

navigationStore.setBackPath(null)

const languages = [
  { lang: Lang.ZH, name: '中文', key: '1' },
  { lang: Lang.EN, name: 'English', key: '2' },
  { lang: Lang.JA, name: '日本語', key: '3' }
]

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp' || event.key === 'w') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + languages.length) % languages.length
  } else if (event.key === 'ArrowDown' || event.key === 's') {
    event.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % languages.length
  } else if (event.key === 'Enter') {
    router.push(`/${languages[selectedIndex.value].lang}`)
  } else if (event.key >= '1' && event.key <= '3') {
    const index = parseInt(event.key) - 1
    router.push(`/${languages[index].lang}`)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style module>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  font-family: var(--font-family);
  padding: 20px;
}

.line {
  font-size: var(--title-font-size);
  color: var(--accent-color)
}

.option {
  display: flex;
  margin: 4px 0;
  padding: 8px 0;
  transition: all 0.1s;
  text-decoration: none;
}

.option:hover {
  background: rgba(51, 255, 51, 0.1);
}

.cursor {
  color: #ffff00;
  margin-right: 8px;
  display: inline-block;
  width: 16px;
  animation: blink 1s infinite;
}

.key {
  color: #ff6600;
  margin-right: 12px;
}

.label {
  color: var(--accent-color);
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
</style>
