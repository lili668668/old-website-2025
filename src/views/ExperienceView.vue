<template>
  <div :class="$style.container">
    <div :class="$style.output">
      <p :class="$style.title">{{ t('title.experience') }}</p>
      <p :class="$style.subtitle">{{ t('subtitle.experience') }}</p>
      <div :class="$style.gameBar">
        <button :class="$style.toggleBtn" @click="gameVisible = !gameVisible">
          {{ gameVisible ? 'Hide Game' : 'Show Game' }}
        </button>
        <p :class="$style.subtitle">Score: {{ score }}</p>
      </div>
    </div>
    <div :class="$style.cards" ref="cardsRef">
      <div
        v-for="key in experienceKeys"
        :key="key"
        :class="[$style.card, $style[key]]"
        data-card
      >
        <div :class="$style.cardHeader">
          <p :class="$style.cardTitle">{{ t(`experienceKey.${key}`) }}</p>
          <button :class="$style.expandBtn" @click="openDialog(key)" :aria-label="t(`experienceKey.${key}`)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </button>
        </div>
        <ul :class="$style.cardList">
          <li v-for="(line, i) in t(`experience.${key}`).split('\n')" :key="i" v-html="line">
          </li>
        </ul>
      </div>
      <template v-if="gameVisible">
        <div
          v-for="p in pellets"
          :key="p.id"
          :class="$style.pellet"
          :style="{ left: p.x + 'px', top: p.y + 'px' }"
        />
        <div
          v-for="(ghost, i) in ghosts"
          :key="'ghost-' + i"
          :class="$style.ghost"
          :style="{
            left: ghost.x + 'px',
            top: ghost.y + 'px',
            background: ghost.color,
            boxShadow: `0 0 6px ${ghost.color}, 0 0 12px ${ghost.color}80`,
          }"
        />
        <img
          :class="$style.dot"
          :src="wink ? imgWink : imgOrigin"
          :style="{ left: dotX + 'px', top: dotY + 'px', transform: `translate(-50%, -50%) rotate(${dotRotation}deg)` }"
          alt="player"
        />
      </template>
    </div>

    <BaseDialog :open="!!dialogKey" :title="dialogKey ? t(`experienceKey.${dialogKey}`) : ''" @close="closeDialog">
      <ul :class="$style.dialogList">
        <li v-for="(line, i) in dialogKey ? t(`experience.${dialogKey}`).split('\n') : []" :key="i">
          {{ line }}
        </li>
      </ul>
    </BaseDialog>

    <div v-if="gameVisible" :class="$style.dpad">
      <button
        :class="[$style.dpadBtn, $style.dpadUp]"
        @pointerdown.prevent="startMove('ArrowUp')"
        @pointerup="stopMove"
        @pointerleave="stopMove"
      >▲</button>
      <button
        :class="[$style.dpadBtn, $style.dpadLeft]"
        @pointerdown.prevent="startMove('ArrowLeft')"
        @pointerup="stopMove"
        @pointerleave="stopMove"
      >◀</button>
      <button
        :class="[$style.dpadBtn, $style.dpadRight]"
        @pointerdown.prevent="startMove('ArrowRight')"
        @pointerup="stopMove"
        @pointerleave="stopMove"
      >▶</button>
      <button
        :class="[$style.dpadBtn, $style.dpadDown]"
        @pointerdown.prevent="startMove('ArrowDown')"
        @pointerup="stopMove"
        @pointerleave="stopMove"
      >▼</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import imgOrigin from '../assets/ballfish/origin.png'
import imgWink from '../assets/ballfish/wink.png'
import { useI18n } from 'vue-i18n'
import { useNavigationStore } from '../stores/navigation'
import { useLangRoute } from '../composables/useLangRoute'
import BaseDialog from '../components/BaseDialog.vue'

const { t } = useI18n()
const { getPath } = useLangRoute()
const navigationStore = useNavigationStore()

navigationStore.setBackPath(getPath(''))

const experienceKeys = [
  'university',
  'Wavenet',
  'Universetech',
  'SITCON',
  'MOPCON',
  'Rust',
  'COSCUP',
  'g0v',
  'else',
]

const cardsRef = ref<HTMLElement | null>(null)
const COLLISION_RADIUS = 2
const STEP = 12
const dotX = ref(8)
const dotY = ref(8)

const checkBlocked = (
  x: number, y: number,
  containerRect: DOMRect,
  cards: NodeListOf<Element>,
  radius = COLLISION_RADIUS,
) => {
  if (x - radius < 0 || x + radius > containerRect.width) return true
  if (y - radius < 0 || y + radius > containerRect.height) return true
  for (const card of cards) {
    const r = card.getBoundingClientRect()
    const cardLeft = r.left - containerRect.left
    const cardTop = r.top - containerRect.top
    const closestX = Math.max(cardLeft, Math.min(x, cardLeft + r.width))
    const closestY = Math.max(cardTop, Math.min(y, cardTop + r.height))
    const dx = x - closestX
    const dy = y - closestY
    if (dx * dx + dy * dy < radius * radius) return true
  }
  return false
}

// --- pellets ---
const PELLET_SPACING = 8
const COLLECT_RADIUS = 10

interface Pellet { id: number; x: number; y: number }
const pellets = ref<Pellet[]>([])
const allEaten = ref(false)
const score = ref(0)
const gameVisible = ref(true)
const dotRotation = ref(0)
const wink = ref(false)
let winkInterval: ReturnType<typeof setInterval> | null = null

const generatePellets = (containerRect: DOMRect, cards: NodeListOf<Element>) => {
  const W = containerRect.width
  const H = containerRect.height
  // corridor gap is 16px; walkable band ≈ 16 - 2*COLLISION_RADIUS = 12px
  const NARROW = 18

  // cache card rects relative to container (avoids repeated getBoundingClientRect)
  const cardRects = Array.from(cards).map(card => {
    const r = card.getBoundingClientRect()
    return {
      l: r.left - containerRect.left,
      t: r.top - containerRect.top,
      r: r.left - containerRect.left + r.width,
      b: r.top - containerRect.top + r.height,
    }
  })

  const isBlocked = (x: number, y: number) => {
    if (x - COLLISION_RADIUS < 0 || x + COLLISION_RADIUS > W) return true
    if (y - COLLISION_RADIUS < 0 || y + COLLISION_RADIUS > H) return true
    for (const c of cardRects) {
      const cx = Math.max(c.l, Math.min(x, c.r))
      const cy = Math.max(c.t, Math.min(y, c.b))
      const dx = x - cx, dy = y - cy
      if (dx * dx + dy * dy < COLLISION_RADIUS * COLLISION_RADIUS) return true
    }
    return false
  }

  const placed = new Set<string>()
  const snap = PELLET_SPACING * 0.7
  const result: Pellet[] = []
  let id = 0

  const tryAdd = (x: number, y: number) => {
    const key = `${Math.round(x / snap)},${Math.round(y / snap)}`
    if (placed.has(key)) return
    placed.add(key)
    result.push({ id: id++, x: Math.round(x), y: Math.round(y) })
  }

  // X-scan: one dot per narrow Y-segment (horizontal corridor lines)
  for (let x = PELLET_SPACING; x <= W - PELLET_SPACING; x += PELLET_SPACING) {
    let start: number | null = null
    for (let y = 0; y <= H + 1; y++) {
      const blocked = y > H || isBlocked(x, y)
      if (!blocked && start === null) { start = y }
      else if (blocked && start !== null) {
        if (y - start <= NARROW) tryAdd(x, (start + y - 1) / 2)
        start = null
      }
    }
  }

  // Y-scan: one dot per narrow X-segment (vertical corridor lines)
  for (let y = PELLET_SPACING; y <= H - PELLET_SPACING; y += PELLET_SPACING) {
    let start: number | null = null
    for (let x = 0; x <= W + 1; x++) {
      const blocked = x > W || isBlocked(x, y)
      if (!blocked && start === null) { start = x }
      else if (blocked && start !== null) {
        if (x - start <= NARROW) tryAdd((start + x - 1) / 2, y)
        start = null
      }
    }
  }

  return result
}

const collectPellets = () => {
  const r2 = COLLECT_RADIUS * COLLECT_RADIUS
  const px = dotX.value, py = dotY.value
  const before = pellets.value.length
  pellets.value = pellets.value.filter(p => {
    const dx = px - p.x, dy = py - p.y
    return dx * dx + dy * dy > r2
  })
  score.value += before - pellets.value.length
  if (before > 0 && pellets.value.length === 0) allEaten.value = true
}

// --- player ---
const movePlayer = (direction: string) => {
  if (dialogKey.value) return

  const container = cardsRef.value
  if (!container) return

  const containerRect = container.getBoundingClientRect()
  const cards = container.querySelectorAll('[data-card]')

  let dx = 0, dy = 0
  if (direction === 'ArrowLeft')  { dx = -1; dotRotation.value = 0 }
  if (direction === 'ArrowRight') { dx =  1; dotRotation.value = 180 }
  if (direction === 'ArrowUp')    { dy = -1; dotRotation.value = 90 }
  if (direction === 'ArrowDown')  { dy =  1; dotRotation.value = 270 }

  for (let i = 0; i < STEP; i++) {
    const newX = dotX.value + dx
    const newY = dotY.value + dy
    if (checkBlocked(newX, newY, containerRect, cards)) break
    dotX.value = newX
    dotY.value = newY
  }
  collectPellets()
  checkGhostCollision()
}

let dpadInterval: ReturnType<typeof setInterval> | null = null

const startMove = (direction: string) => {
  movePlayer(direction)
  dpadInterval = setInterval(() => movePlayer(direction), 80)
}

const stopMove = () => {
  if (dpadInterval) {
    clearInterval(dpadInterval)
    dpadInterval = null
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
  e.preventDefault()
  movePlayer(e.key)
}


const frightenedUntil = ref(0)

const checkGhostCollision = () => {
  const px = dotX.value, py = dotY.value
  for (const ghost of ghosts.value) {
    const dx = px - ghost.x, dy = py - ghost.y
    if (dx * dx + dy * dy < 144) { // 12px = sum of visual radii
      score.value = 0
      frightenedUntil.value = Date.now() + 5000
      return
    }
  }
}

type Dir = 0 | 1 | 2 | 3
const DIR_VECS: [number, number][] = [[1,0],[-1,0],[0,1],[0,-1]]

interface Ghost {
  x: number
  y: number
  color: string
  dir: Dir
}

const GHOST_CONFIGS = [
  { color: '#ff4444' },
  { color: '#ff88cc' },
  { color: '#00e5ff' },
  { color: '#ff9900' },
]

const ghosts = ref<Ghost[]>(
  GHOST_CONFIGS.map((g, i) => ({
    x: 0,
    y: 0,
    color: g.color,
    dir: (i % 4) as Dir,
  }))
)

const GHOST_VISUAL_RADIUS = 6
const ghostSpawnPool: { x: number; y: number }[] = []

const buildGhostSpawnPool = (containerRect: DOMRect, cards: NodeListOf<Element>) => {
  ghostSpawnPool.length = 0
  const step = 4
  for (let x = GHOST_VISUAL_RADIUS; x <= containerRect.width - GHOST_VISUAL_RADIUS; x += step) {
    for (let y = GHOST_VISUAL_RADIUS; y <= containerRect.height - GHOST_VISUAL_RADIUS; y += step) {
      if (!checkBlocked(x, y, containerRect, cards, GHOST_VISUAL_RADIUS)) {
        ghostSpawnPool.push({ x, y })
      }
    }
  }
}

const randomValidPosition = () => {
  if (ghostSpawnPool.length === 0) return { x: GHOST_VISUAL_RADIUS, y: GHOST_VISUAL_RADIUS }
  return ghostSpawnPool[Math.floor(Math.random() * ghostSpawnPool.length)]
}

let ghostInterval: ReturnType<typeof setInterval> | null = null

const stepGhosts = () => {
  const container = cardsRef.value
  if (!container) return
  const containerRect = container.getBoundingClientRect()
  const cards = container.querySelectorAll('[data-card]')

  const px = dotX.value, py = dotY.value

  const frightened = Date.now() < frightenedUntil.value

  for (const ghost of ghosts.value) {
    // chase: closest first / frightened: farthest first
    const sorted = ([0, 1, 2, 3] as Dir[]).sort((a, b) => {
      const [ax, ay] = DIR_VECS[a]
      const [bx, by] = DIR_VECS[b]
      const da = (ghost.x + ax - px) ** 2 + (ghost.y + ay - py) ** 2
      const db = (ghost.x + bx - px) ** 2 + (ghost.y + by - py) ** 2
      return frightened ? db - da : da - db
    })

    for (const d of sorted) {
      const [vx, vy] = DIR_VECS[d]
      const nx = ghost.x + vx
      const ny = ghost.y + vy
      if (!checkBlocked(nx, ny, containerRect, cards)) {
        ghost.x = nx
        ghost.y = ny
        ghost.dir = d
        break
      }
    }
  }
  checkGhostCollision()
}

const initGame = async () => {
  await nextTick()
  const container = cardsRef.value
  if (!container) return
  const containerRect = container.getBoundingClientRect()
  const cards = container.querySelectorAll('[data-card]')
  dotX.value = 8
  dotY.value = 8
  score.value = 0
  allEaten.value = false
  buildGhostSpawnPool(containerRect, cards)
  for (const ghost of ghosts.value) {
    const pos = randomValidPosition()
    ghost.x = pos.x
    ghost.y = pos.y
  }
  pellets.value = generatePellets(containerRect, cards)
}

let resizeObserver: ResizeObserver | null = null
let lastWidth = 0

onMounted(async () => {
  window.addEventListener('keydown', handleKeyDown)
  await initGame()
  ghostInterval = setInterval(stepGhosts, 25)
  winkInterval = setInterval(() => { wink.value = !wink.value }, 400)
  lastWidth = window.innerWidth
  resizeObserver = new ResizeObserver(() => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth
      initGame()
    }
  })
  resizeObserver.observe(document.body)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (ghostInterval) clearInterval(ghostInterval)
  if (winkInterval) clearInterval(winkInterval)
  if (dpadInterval) clearInterval(dpadInterval)
  resizeObserver?.disconnect()
})

const dialogKey = ref<string | null>(null)

const openDialog = (key: string) => {
  dialogKey.value = key
}

const closeDialog = () => {
  dialogKey.value = null
}

</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  font-family: var(--font-family);
}

.output {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.title {
  font-size: var(--title-font-size);
  color: var(--accent-color);
  margin: 8px 0 8px 0;
}

.subtitle {
  font-size: var(--p-font-size);
  color: var(--text-color);
  margin: 0;
}

.gameBar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.toggleBtn {
  background: none;
  border: 1px solid var(--text-color);
  color: var(--text-color);
  font-family: var(--font-family);
  font-size: var(--p-font-size);
  padding: 2px 10px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toggleBtn:hover {
  opacity: 1;
}

.university {
  grid-column: 4;
  grid-row: 4;
}

.Wavenet {
  grid-column: 1;
  grid-row: 1;
}

.Universetech {
  grid-column: 2/4;
  grid-row: 1/3;
}

.SITCON {
  grid-column: 2;
  grid-row: 3;
}

.MOPCON {
  grid-column: 3;
  grid-row: 3;
}

.Rust {
  grid-column: 1;
  grid-row: 4;
}

.COSCUP {
  grid-column: 4;
  grid-row: 1/4;
}

.g0v {
  grid-column: 2/4;
  grid-row: 4;
}

.else {
  grid-column: 1;
  grid-row: 2/4;
}

.cards {
  position: relative;
  padding: 16px;
  display: grid;
  grid-template-columns: 300px 200px 200px 300px;
  grid-template-rows: 150px 200px 150px 150px;
  gap: 16px;
}

.dot {
  position: absolute;
  width: 32px;
  height: 32px;
  image-rendering: pixelated;
  pointer-events: none;
  z-index: 10;
  transition: left 0.08s linear, top 0.08s linear, transform 0.1s ease;
}

.ghost {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9;
}

.pellet {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

.card {
  border: 1px solid #f5e342;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 150px;
}

.cardHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  flex-shrink: 0;
}

.expandBtn {
  background: none;
  border: 1px solid #f5e342;
  color: #f5e342;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.expandBtn:hover {
  opacity: 1;
}

.cardTitle {
  font-size: var(--title-font-size);
  color: var(--accent-color);
  margin: 0;
}

.cardList {
  font-size: var(--p-font-size);
  color: var(--text-color);
  line-height: 1.8;
  margin: 0;
  padding-left: 18px;
  text-align: left;
}

.dialogList {
  font-size: var(--p-font-size);
  color: var(--text-color);
  line-height: 1.8;
  margin: 0;
  padding-left: 18px;
  text-align: left;
}

.dpad {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.dpadBtn {
  position: absolute;
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  touch-action: none;
  transition: background 0.1s;
}

.dpadBtn:active {
  background: rgba(255, 255, 255, 0.45);
}

.dpadUp {
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
}

.dpadDown {
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
}

.dpadLeft {
  top: 50%;
  left: 6px;
  transform: translateY(-50%);
}

.dpadRight {
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
}

@media (max-width: 1350px) {
  .cards {
    grid-template-columns: 250px 150px 150px 250px;
    grid-template-rows: 150px 200px 150px 150px;
  }
}

@media (max-width: 1100px) {
  .university {
    grid-column: 3;
    grid-row: 3;
  }

  .Wavenet {
    grid-column: 1/3;
    grid-row: 3;
  }

  .Universetech {
    grid-column: 1/4;
    grid-row: 1;
  }

  .SITCON {
    grid-column: 2/4;
    grid-row: 4;
  }

  .MOPCON {
    grid-column: 1;
    grid-row: 4;
  }

  .Rust {
    grid-column: 3;
    grid-row: 5;
  }

  .COSCUP {
    grid-column: 1/4;
    grid-row: 2;
  }

  .g0v {
    grid-column: 1/3;
    grid-row: 5;
  }

  .else {
    grid-column: 1/4;
    grid-row: 6;
  }

  .cards {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 300px 200px 150px 150px 150px 200px;
  }
}

@media (max-width: 700px) {
  .university {
    grid-column: 1;
    grid-row: 4;
  }

  .Wavenet {
    grid-column: 1;
    grid-row: 3;
  }

  .Universetech {
    grid-column: 1;
    grid-row: 1;
  }

  .SITCON {
    grid-column: 1;
    grid-row: 5;
  }

  .MOPCON {
    grid-column: 1;
    grid-row: 6;
  }

  .Rust {
    grid-column: 1;
    grid-row: 7;
  }

  .COSCUP {
    grid-column: 1;
    grid-row: 2;
  }

  .g0v {
    grid-column: 1;
    grid-row: 8;
  }

  .else {
    grid-column: 1;
    grid-row: 9;
  }

  .cards {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 200px 150px 150px 150px 150px 150px 150px 200px;
  }
}
</style>
