<template>
  <div :class="$style.container" tabindex="0" @keydown="onKeyDown" ref="containerRef">
    <div :class="$style.header">
      <span :class="$style.title">{{ current.name }}</span>
      <span :class="$style.index">{{ currentIndex + 1 }} / {{ items.length }}</span>
    </div>

    <div :class="$style.stage">
      <button :class="[$style.navBtn, $style.navLeft]" @click="prev" :disabled="currentIndex === 0">
        <span>&#8592;</span>
      </button>

      <div :class="$style.artWrapper">
        <component :is="current.component" />
      </div>

      <button :class="[$style.navBtn, $style.navRight]" @click="next" :disabled="currentIndex === items.length - 1">
        <span>&#8594;</span>
      </button>
    </div>

    <div :class="$style.dots">
      <span
        v-for="(item, i) in items"
        :key="item.name"
        :class="[$style.dot, i === currentIndex && $style.dotActive]"
        @click="currentIndex = i"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useLangRoute } from '../composables/useLangRoute'
import BotfishAscii from '@/components/ascii/BotfishAscii.vue'
import SupercubeAscii from '@/components/ascii/SupercubeAscii.vue'
import E5Ascii from '@/components/ascii/E5Ascii.vue'

const { getPath } = useLangRoute()
const navigationStore = useNavigationStore()
navigationStore.setBackPath(getPath(''))

const items = [
  { name: 'Botfish', component: BotfishAscii },
  { name: 'Supercube', component: SupercubeAscii },
  { name: 'E5', component: E5Ascii },
]

const currentIndex = ref(0)
const current = ref(items[0])

const containerRef = ref<HTMLElement | null>(null)

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    current.value = items[currentIndex.value]
  }
}

function next() {
  if (currentIndex.value < items.length - 1) {
    currentIndex.value++
    current.value = items[currentIndex.value]
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}

onMounted(() => {
  containerRef.value?.focus()
})
</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  font-family: var(--font-family);
  padding: 20px;
  min-height: 100%;
}

.header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
}

.title {
  font-size: var(--title-font-size);
  color: var(--accent-color);
}

.index {
  font-size: var(--p-font-size);
  color: var(--font-color);
  opacity: 0.6;
}

.stage {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.artWrapper {
  flex: 1;
  overflow: auto;
  color: white;
}

.navBtn {
  background: none;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  font-size: 20px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: background 0.15s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.navBtn:hover:not(:disabled) {
  background: rgba(51, 255, 51, 0.15);
}

.navBtn:disabled {
  opacity: 0.2;
  cursor: default;
}

.dots {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-color);
  opacity: 0.3;
  cursor: pointer;
  transition: opacity 0.2s;
}

.dotActive {
  opacity: 1;
}
</style>
