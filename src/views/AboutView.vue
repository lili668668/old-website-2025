<template>
  <div :class="$style.container">
    <div class="output">
      <p :class="$style.title">{{ t('title.about') }}</p>
      <p :class="$style.subtitle">{{ t('subtitle.about') }}</p>
      <div :class="$style.double">
        <div :class="$style.sprite">
          <img :src="currentFrame" alt="ballfish" :class="$style.spriteImg" />
        </div>
        <div :class="$style.right">
          <ul>
            <li v-for="item in (tm('about.items') as string[])" :key="item">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNavigationStore } from '../stores/navigation'
import { useLangRoute } from '../composables/useLangRoute'
import originImg from '../assets/ballfish/origin.png'
import winkImg from '../assets/ballfish/wink.png'

const { t, tm } = useI18n()
const { getPath } = useLangRoute()
const navigationStore = useNavigationStore()

const frames = [originImg, winkImg]
const frameIndex = ref(0)
const currentFrame = computed(() => frames[frameIndex.value])
let frameTimer: ReturnType<typeof setInterval> | null = null

navigationStore.setBackPath(getPath(''))

onMounted(() => {
  frameTimer = setInterval(() => {
    frameIndex.value = frameIndex.value === 0 ? 1 : 0
  }, 400)
})

onUnmounted(() => {
  if (frameTimer) clearInterval(frameTimer)
})
</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  outline: none;
  font-family: var(--font-family);
  padding: 20px;
}

.sprite {
  margin-bottom: 16px;
}

.spriteImg {
  width: 128px;
  height: 128px;
  image-rendering: pixelated;
}

.title {
  font-size: var(--title-font-size);
  color: var(--accent-color)
}

.subtitle {
  font-size: var(--p-font-size);
  color: var(--font-color);
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

.double {
  display: flex;
  flex-direction: row;
}

.right {
  text-align: left;
  max-width: 250px;
}

@keyframes blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
</style>
