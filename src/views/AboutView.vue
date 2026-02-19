<template>
  <div :class="$style.container">
    <p :class="$style.title">{{ t('title.about') }}</p>
    <p :class="$style.subtitle">{{ t('subtitle.about') }}</p>
    <div :class="$style.diagram">
      <svg viewBox="0 0 2400 1020" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="about-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="white" />
          </marker>
        </defs>

        <!-- Fish sprite image -->
        <image :href="currentFrame" x="961" y="169" width="512" height="512"
                style="image-rendering: pixelated;" />

        <!-- 頭頂 (x=1201, y=189) → about.name：向上 -->
        <line x1="1201" y1="300" x2="1201" y2="150"
              stroke="white" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="820" y="45" width="760" height="62">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.name') }}
          </div>
        </foreignObject>

        <!-- 嘴巴 (x=1009, y=441) → about.nickname：向左 -->
        <line x1="1009" y1="441" x2="800" y2="441"
              stroke="white" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="20" y="411" width="775" height="65">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.nickname') }}
          </div>
        </foreignObject>

        <!-- 手 (x=1049, y=361) → about.dream：左下 -->
        <line x1="1049" y1="361" x2="800" y2="553"
              stroke="white" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="20" y="533" width="775" height="100">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.dream') }}
          </div>
        </foreignObject>

        <!-- 肚子 (x=1169, y=561) → about.charactor：向下 -->
        <line x1="1169" y1="561" x2="1000" y2="755"
              stroke="white" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="100" y="755" width="1050" height="240">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.charactor') }}
          </div>
        </foreignObject>

        <!-- 尾巴 (x=1409, y=361) → about.interest：向右 -->
        <line x1="1409" y1="361" x2="1530" y2="325"
              stroke="white" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="1535" y="100" width="840" height="500">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.interest') }}
          </div>
        </foreignObject>
      </svg>
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

const { t } = useI18n()
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
  width: 100%;
}

.title {
  font-size: var(--title-font-size);
  color: var(--accent-color)
}

.subtitle {
  font-size: var(--p-font-size);
  color: var(--font-color);
}

.diagram {
  width: 100%;
}

.label {
  font-family: var(--font-family);
  font-size: 50px;
  color: white;
  line-height: 1.5;
}
</style>
