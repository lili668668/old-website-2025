<template>
  <div :class="$style.container">
    <p :class="$style.title">{{ t('title.about') }}</p>
    <p :class="$style.subtitle">{{ t('subtitle.about') }}</p>
    <p :class="$style.tip">{{ t('about.tip') }}</p>
    <div :class="$style.mobileFish">
      <div :class="$style.fishWrapper">
        <img :src="currentFrame" :class="$style.fishImg" />
        <div
          v-for="part in bodyParts"
          :key="part.key"
          :class="$style.annotationDot"
          :style="{ top: part.top, left: part.left }"
        >
          <svg :class="$style.raysSvg" viewBox="-40 -40 80 80" xmlns="http://www.w3.org/2000/svg">
            <circle :class="$style.ripple" cx="0" cy="0" r="9" fill="none" />
          </svg>
          <div :class="$style.dotCenter" />
        </div>
      </div>
    </div>

    <div :class="$style.diagram">
      <svg :viewBox="`0 0 2600 ${svgHeight}`" xmlns="http://www.w3.org/2000/svg">
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
        <foreignObject x="0" y="580" width="800" :height="charactorHeight">
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
import { useNavigationStore } from '@/stores/navigation'
import { useLangRoute } from '@/composables/useLangRoute'
import originImg from '@/assets/ballfish/origin.png'
import winkImg from '@/assets/ballfish/wink.png'
import { Lang } from '@/constants/Lang'

const { t } = useI18n()
const { getPath, lang } = useLangRoute()
const navigationStore = useNavigationStore()

const bodyParts = [
  { key: 'head',  top: '20%',  left: '40%' },
  { key: 'mouth', top: '53%', left: '28%' },
  { key: 'belly', top: '63%', left: '18%' },
  { key: 'hands', top: '60%', left: '55%' },
  { key: 'tail',  top: '65%', left: '90%' },
]

const frames = [originImg, winkImg]
const frameIndex = ref(0)
const currentFrame = computed(() => frames[frameIndex.value])
const svgHeight = computed(() => {
  switch (lang) {
    case Lang.ZH:
      return 1000
    case Lang.EN:
      return 1500
  }
  return 1000
})
const charactorHeight = computed(() => {
  switch (lang) {
    case Lang.ZH:
      return 450
    case Lang.EN:
      return 1000
  }
  return 450
})

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

.tip {
  line-height: 0;
  font-size: 12px;
  color: gray;
}

@keyframes drawLine {
  from { stroke-dashoffset: 1000; }
  to { stroke-dashoffset: 0; }
}

@keyframes wipeIn {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0% 0 0); }
}

.mobileFish {
  display: none;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 16px 0;
}

.fishWrapper {
  position: relative;
  width: min(80vw, 80vh);
  height: min(80vw, 80vh);
}

.fishImg {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}

.annotationDot {
  position: absolute;
  width: 0;
  height: 0;
  transform: translate(-50%, -50%);
}

.raysSvg {
  position: absolute;
  width: 80px;
  height: 80px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: visible;
}

.ripple {
  stroke: #888888;
  stroke-width: 3;
  fill: none;
  animation: rippleOut 2s ease-out infinite;
}

.dotCenter {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid #888888;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

@keyframes rippleOut {
  0% {
    r: 9;
    opacity: 1;
  }
  100% {
    r: 20;
    opacity: 0;
  }
}

.diagram {
  width: 100%;
}

@media (max-width: 500px) {
  .diagram {
    display: none;
  }

  .mobileFish {
    display: flex;
  }
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
