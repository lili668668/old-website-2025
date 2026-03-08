<template>
  <div :class="$style.container">
    <div :class="$style.output">
      <p :class="$style.title">{{ t('title.experience') }}</p>
      <p :class="$style.subtitle">{{ t('subtitle.experience') }}</p>
    </div>
    <div :class="$style.cards">
      <div
        v-for="key in experienceKeys"
        :key="key"
        :class="[$style.card, $style[key]]"
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
    </div>

    <BaseDialog :open="!!dialogKey" :title="dialogKey ? t(`experienceKey.${dialogKey}`) : ''" @close="closeDialog">
      <ul :class="$style.dialogList">
        <li v-for="(line, i) in dialogKey ? t(`experience.${dialogKey}`).split('\n') : []" :key="i">
          {{ line }}
        </li>
      </ul>
    </BaseDialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  border: 1px solid #f5e342;
  padding: 16px;
  display: grid;
  grid-template-columns: 300px 200px 200px 300px;
  grid-template-rows: 150px 200px 150px 150px;
  gap: 20px;
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
