<template>
  <div :class="$style.container">
    <p :class="$style.title">{{ t('title.history') }}</p>
    <p :class="$style.description">{{ t('subtitle.history') }}</p>
    <div :class="$style.circleContainer">
      <div
        v-for="(item, index) in items"
        :key="item"
        :class="$style.line"
        @mouseenter="currentIndex = index"
        @click="enterWebsite"
      >
        <div :class="[$style.circle, index < items.length - 1 && $style.straight]">
          <img
            v-if="currentIndex === index"
            :height="12"
            :width="12"
            :src="wink ? imgWink : imgOrigin"
          />
        </div>
        <div :class="{ [$style.selected]: currentIndex === index }">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNavigationStore } from '@/stores/navigation'
import { useLangRoute } from '../composables/useLangRoute'
import imgOrigin from '../assets/ballfish/origin.png'
import imgWink from '../assets/ballfish/wink.png'

const { t } = useI18n()
const { getPath } = useLangRoute()
const navigationStore = useNavigationStore()
navigationStore.setBackPath(getPath(''))

const wink = ref(false)
let winkInterval: ReturnType<typeof setInterval> | null = null

const items = [2020, 2017]
const currentIndex = ref(0)

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < items.length - 1) currentIndex.value++
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') prev()
  else if (e.key === 'ArrowDown') next()
  else if (e.key === 'Enter') enterWebsite()
}

function enterWebsite() {
  window.open(`https://ballfish.io/old-website-${items[currentIndex.value]}`, '_blank')
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  winkInterval = setInterval(() => {
    wink.value = !wink.value
  }, 400)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  if (winkInterval) clearInterval(winkInterval)
})
</script>

<style module>
.circleContainer {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.line {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.circle {
  position: relative;
  width: 8px;
  height: 8px;
  border: 10px solid transparent;
  border-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><text x='5' y='5' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text><text x='15' y='5' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text><text x='25' y='5' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text><text x='5' y='15' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text><text x='15' y='15' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text><text x='25' y='15' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text><text x='5' y='25' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text><text x='15' y='25' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text><text x='25' y='25' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text></svg>")
    10 round;
}

.straight:not(:last-child)::after {
  content: '';
  position: absolute;
  top: calc(100% + 10px); /* 從邊框外緣開始 */
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 24px; /* 符合 gap: 24px */
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='8'><text x='5' y='4' font-size='10' font-family='monospace' fill='%23348feb' text-anchor='middle' dominant-baseline='central'>*</text></svg>");
  background-repeat: repeat-y;
  background-position: center;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  font-family: var(--font-family);
  padding: 20px;
  min-height: 100%;
}

.title {
  font-size: var(--title-font-size);
  color: var(--font-color);
}

.description {
  font-size: var(--p-font-size);
  color: var(--font-color);
}

.selected {
  color: #348feb;
  font-weight: bold;
}
</style>
