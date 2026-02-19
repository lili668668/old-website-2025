<template>
  <div :class="$style.container">
    <p :class="$style.title">{{ t('title.about') }}</p>
    <p :class="$style.subtitle">{{ t('subtitle.about') }}</p>
    <div :class="$style.diagram">
      <svg viewBox="0 0 2400 900" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="about-arrow" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <path d="M0,0 L8,3 L0,6 Z" fill="#33ff33" />
          </marker>
        </defs>

        <!-- Fish sprite image, centered in the diagram -->
        <image :href="currentFrame" x="961" y="169" width="512" height="512"
                style="image-rendering: pixelated;" />

        <!-- <image :href="currentFrame" x="1072" y="280" width="256" height="256"
                style="image-rendering: pixelated;" /> -->

        <!-- 頭頂 → about.name -->
        <line x1="1200" y1="296" x2="1200" y2="136"
              stroke="#33ff33" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="880" y="36" width="640" height="92">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.name') }}
          </div>
        </foreignObject>

        <!-- 嘴巴 → about.nickname -->
        <line x1="1098" y1="420" x2="904" y2="420"
              stroke="#33ff33" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="420" y="380" width="476" height="92">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.nickname') }}
          </div>
        </foreignObject>

        <!-- 手 → about.dream -->
        <line x1="1112" y1="380" x2="824" y2="576"
              stroke="#33ff33" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="420" y="556" width="396" height="130">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.dream') }}
          </div>
        </foreignObject>

        <!-- 肚子 → about.charactor -->
        <line x1="1170" y1="480" x2="1024" y2="708"
              stroke="#33ff33" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="520" y="708" width="720" height="310">
          <div xmlns="http://www.w3.org/1999/xhtml" :class="$style.label">
            {{ t('about.charactor') }}
          </div>
        </foreignObject>

        <!-- 尾巴 → about.interest -->
        <line x1="1314" y1="376" x2="1496" y2="340"
              stroke="#33ff33" stroke-width="3" marker-end="url(#about-arrow)" />
        <foreignObject x="1500" y="116" width="476" height="460">
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
  font-size: 26px;
  color: var(--accent-color);
  line-height: 1.5;
}
</style>
