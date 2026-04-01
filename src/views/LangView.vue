<template>
  <div :class="$style.container">
    <div>
      <p :class="$style.line">Select your language:</p>
      <CursorSelector :items="languages" v-model="selectedIndex" @confirm="onConfirm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Lang } from '@/constants/Lang'
import { useNavigationStore } from '@/stores/navigation'
import CursorSelector from '@/components/base/CursorSelector.vue'

const router = useRouter()
const navigationStore = useNavigationStore()
const selectedIndex = ref(0)

navigationStore.setBackPath(null)

const languages = [
  { lang: Lang.ZH, label: '中文', key: '1' },
  { lang: Lang.EN, label: 'English', key: '2' },
  { lang: Lang.JA, label: '日本語', key: '3' },
]

function onConfirm(index: number) {
  router.push(`/${languages[index].lang}`)
}
</script>

<style module>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  font-family: var(--font-family);
  padding: 20px;
}

.line {
  font-size: var(--title-font-size);
  color: var(--accent-color);
}
</style>
