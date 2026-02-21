<template>
  <div :class="$style.container">
    <div class="output">
      <p :class="$style.title">{{ t('title.skill') }}</p>
      <p :class="$style.subtitle">{{ t('subtitle.skill') }}</p>
    </div>
    <div :class="$style.mapWrapper">
      <svg
        :width="SVG_W"
        :height="svgHeight"
        :viewBox="`0 0 ${SVG_W} ${svgHeight}`"
        :class="$style.svg"
      >
        <defs>
          <filter id="sk-shadow" x="-20%" y="-30%" width="140%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.1)" />
          </filter>
        </defs>

        <!-- Root → Category connections -->
        <path
          v-for="(g, gi) in positions"
          :key="`rc-${gi}`"
          :d="curve(ROOT_X + ROOT_W, rootCenterY, CAT_X, g.catY)"
          fill="none"
          :stroke="COLORS[gi]"
          stroke-width="2"
          stroke-opacity="0.55"
        />

        <!-- Category → Item connections -->
        <template v-for="(g, gi) in positions" :key="`ci-g-${gi}`">
          <path
            v-for="(iy, ii) in g.itemYs"
            :key="`ci-${gi}-${ii}`"
            :d="curve(CAT_X + CAT_W, g.catY, ITEM_X, iy)"
            fill="none"
            :stroke="COLORS[gi]"
            stroke-width="1.5"
            stroke-opacity="0.38"
          />
        </template>

        <!-- Item nodes -->
        <template v-for="(g, gi) in positions" :key="`in-g-${gi}`">
          <g v-for="(iy, ii) in g.itemYs" :key="`in-${gi}-${ii}`">
            <rect
              :x="ITEM_X"
              :y="iy - ITEM_H / 2"
              :width="ITEM_W"
              :height="ITEM_H"
              rx="8"
              fill="white"
              :stroke="COLORS[gi]"
              stroke-width="1.5"
              filter="url(#sk-shadow)"
            />
            <text
              :x="ITEM_X + ITEM_W / 2"
              :y="iy"
              text-anchor="middle"
              dominant-baseline="central"
              :fill="COLORS[gi]"
              font-size="11.5"
              font-family="var(--font-family, sans-serif)"
            >{{ t(`skill.${skillGroups[gi].key}.${skillGroups[gi].items[ii]}`) }}</text>
          </g>
        </template>

        <!-- Category nodes -->
        <g v-for="(g, gi) in positions" :key="`cn-${gi}`">
          <rect
            :x="CAT_X"
            :y="g.catY - CAT_H / 2"
            :width="CAT_W"
            :height="CAT_H"
            rx="12"
            :fill="COLORS[gi]"
            filter="url(#sk-shadow)"
          />
          <text
            :x="CAT_X + CAT_W / 2"
            :y="g.catY"
            text-anchor="middle"
            dominant-baseline="central"
            fill="white"
            font-size="13"
            font-weight="600"
            font-family="var(--font-family, sans-serif)"
          >{{ t(`skill.${skillGroups[gi].key}.title`) }}</text>
        </g>

        <!-- Root node (rendered last so it sits on top) -->
        <rect
          :x="ROOT_X"
          :y="rootCenterY - ROOT_H / 2"
          :width="ROOT_W"
          :height="ROOT_H"
          rx="14"
          fill="#2c3e50"
          filter="url(#sk-shadow)"
        />
        <text
          :x="ROOT_X + ROOT_W / 2"
          :y="rootCenterY"
          text-anchor="middle"
          dominant-baseline="central"
          fill="white"
          font-size="15"
          font-weight="bold"
          font-family="var(--font-family, sans-serif)"
        >{{ t('title.skill') }}</text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNavigationStore } from '@/stores/navigation'
import { useLangRoute } from '@/composables/useLangRoute'

const { t } = useI18n()
const { getPath } = useLangRoute()
const navigationStore = useNavigationStore()

navigationStore.setBackPath(getPath(''))

// ── Skill data (keys match locale JSON structure) ─────────────
const skillGroups = [
  { key: 'frontend', items: ['React', 'Vue', 'HTML/CSS/JavaScript(TypeScript)'] },
  { key: 'backend',  items: ['Laravel', 'NodeJS', 'Rust', 'GraphQL', 'GRPC'] },
  { key: 'data',     items: ['MySQL', 'MongoDB', 'ClickHouse', 'Redis', 'SeaweedFS'] },
  { key: 'language', items: ['JavaScript/TypeScript', 'PHP', 'Python3', 'Rust', 'Dart', 'C#', 'Golang', 'Java'] },
  { key: 'app',      items: ['Flutter', 'Capacitor'] },
  { key: 'infra',    items: ['CI', 'CD', 'docker', 'ansible', 'terraform'] },
  { key: 'cloud',    items: ['GCP', 'China', 'VPS'] },
  { key: 'else',     items: ['Linux', 'git', 'vim'] },
]

// ── Layout constants ──────────────────────────────────────────
const ROOT_X = 24
const ROOT_W = 110
const ROOT_H = 48

const CAT_X = 200
const CAT_W = 158
const CAT_H = 40

const ITEM_X = 422
const ITEM_W = 292
const ITEM_H = 30

const ITEM_GAP  = 40   // vertical distance between item centres
const GROUP_GAP = 24   // extra space between category groups
const PAD_TOP   = 48
const PAD_BOT   = 48
const SVG_W     = 740

// ── Category colours ──────────────────────────────────────────
const COLORS = [
  '#4e79a7',  // frontend  – steel blue
  '#f28e2b',  // backend   – orange
  '#59a14f',  // data      – green
  '#af7aa1',  // language  – mauve
  '#e15759',  // app       – red
  '#76b7b2',  // infra     – teal
  '#c4a535',  // cloud     – gold
  '#9c6b98',  // else      – purple
]

// ── Computed layout ───────────────────────────────────────────
const positions = computed(() => {
  let y = PAD_TOP
  return skillGroups.map((group) => {
    const n = group.items.length
    const itemYs = Array.from({ length: n }, (_, i) => y + i * ITEM_GAP + ITEM_GAP / 2)
    const catY = (itemYs[0] + itemYs[n - 1]) / 2
    y += n * ITEM_GAP + GROUP_GAP
    return { catY, itemYs }
  })
})

const svgHeight = computed(() => {
  const last = positions.value[positions.value.length - 1]
  return last.itemYs[last.itemYs.length - 1] + ITEM_GAP / 2 + PAD_BOT
})

const rootCenterY = computed(() => {
  const catYs = positions.value.map((g) => g.catY)
  return (catYs[0] + catYs[catYs.length - 1]) / 2
})

// ── Cubic bezier: smooth S-curve left→right ───────────────────
function curve(x1: number, y1: number, x2: number, y2: number): string {
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}
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

.mapWrapper {
  width: 100%;
  overflow-x: auto;
  padding: 16px 0 48px;
}

.svg {
  display: block;
  margin: 0 auto;
}
</style>
