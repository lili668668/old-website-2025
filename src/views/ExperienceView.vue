<template>
  <div :class="$style.container">
    <div :class="$style.header">
      <p :class="$style.title">{{ t('title.experience') }}</p>
      <p :class="$style.subtitle">{{ t('subtitle.experience') }}</p>
    </div>
    <div :class="$style.cards">
      <div
        v-for="key in experienceKeys"
        :key="key"
        :class="$style.card"
        :style="cardSizes[key]"
      >
        <p :class="$style.cardTitle">{{ key }}</p>
        <ul :class="$style.cardList">
          <li v-for="(line, i) in t(`experience.${key}`).split('\n')" :key="i">
            {{ line }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNavigationStore } from '../stores/navigation'
import { useLangRoute } from '../composables/useLangRoute'

const { t } = useI18n()
const { getPath } = useLangRoute()
const navigationStore = useNavigationStore()

navigationStore.setBackPath(getPath(''))

const experienceKeys = [
  'university',
  'wavenet',
  'universetech',
  'SITCON',
  'MOPCON',
  'Rust',
  'COSCUP',
  'g0v Summit',
  'Else',
]

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const cardSizes = Object.fromEntries(
  experienceKeys.map((key) => [
    key,
    { width: `${rand(200, 300)}px`, height: `${rand(300, 400)}px` },
  ]),
)
</script>

<style module>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  font-family: var(--font-family);
  padding: 20px;
  gap: 24px;
}

.header {
  width: 100%;
  max-width: 1400px;
}

.title {
  font-size: var(--title-font-size);
  color: var(--accent-color);
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: var(--p-font-size);
  color: var(--text-color);
  margin: 0;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
}

.card {
  border: 1px solid var(--border-color);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.cardTitle {
  font-size: var(--title-font-size);
  color: var(--accent-color);
  margin: 0;
  flex-shrink: 0;
}

.cardList {
  font-size: var(--p-font-size);
  color: var(--text-color);
  line-height: 1.8;
  margin: 0;
  padding-left: 18px;
  text-align: left;
}

@media (max-width: 700px) {
  .container {
    padding: 10px;
  }

  .card {
    width: 100% !important;
  }
}
</style>
