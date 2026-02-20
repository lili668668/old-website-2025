<template>
  <div :class="$style.container">
    <p :class="$style.title">{{ t('title.about') }}</p>
    <p :class="$style.subtitle">{{ t('subtitle.about') }}</p>
    <div :class="$style.diagram">
      <svg viewBox="0 0 2600 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="about-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path style="fill: var(--accent-color)" />
          </marker>
        </defs>

        <image :href="currentFrame" x="961" y="169" width="512" height="512"
                style="image-rendering: pixelated;" />

        <polyline :class="$style.animatedLine" points="1201,300 1074,80 900,80"
                  fill="none" stroke-width="6" style="stroke: var(--accent-color)" marker-end="url(#about-arrow)" />
        <foreignObject x="550" y="40" width="375" height="80">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.name') }}
          </div>
        </foreignObject>

        <polyline :class="$style.animatedLine" points="1090,441 940,360 800,360"
                  fill="none" stroke-width="6" style="stroke: var(--accent-color)" marker-end="url(#about-arrow)" />
        <foreignObject x="500" y="325" width="300" height="80">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.nickname') }}
          </div>
        </foreignObject>

        <polyline :class="$style.animatedLine" points="1049,500 924,650 850,650"
                  fill="none" stroke-width="6" style="stroke: var(--accent-color)" marker-end="url(#about-arrow)" />
        <foreignObject x="0" y="580" width="800" height="450">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.charactor') }}
          </div>
        </foreignObject>

        <polyline :class="$style.animatedLine" points="1245,500 1350,760 1480,760"
                  fill="none" stroke-width="6" style="stroke: var(--accent-color)" marker-end="url(#about-arrow)" />
        <foreignObject x="1520" y="680" width="900" height="160">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.dream') }}
          </div>
        </foreignObject>

        <polyline :class="$style.animatedLine" points="1409,500 1594,300 1750,300"
                  fill="none" stroke-width="6" style="stroke: var(--accent-color)" marker-end="url(#about-arrow)" />
        <foreignObject x="1800" y="200" width="760" height="300">
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

@keyframes drawLine {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

@keyframes wipeIn {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0% 0 0); }
}

.diagram {
  width: 100%;
}

.animatedLine {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 1s ease-out forwards;
}

.label {
  font-family: var(--font-family);
  font-size: 50px;
  color: white;
  line-height: 1.5;
  text-align: left;
  clip-path: inset(0 100% 0 0);
  animation: wipeIn 0.4s ease-out 0.6s forwards;
}
</style>
