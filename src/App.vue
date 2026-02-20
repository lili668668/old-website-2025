<template>
  <div>
    <div :class="$style['nav']">
      <RouterLink to="/" :class="$style['home-button']" @click="($event.currentTarget as HTMLElement)?.blur()">
        <div :class="$style['home-logo']">
          <span></span><span></span><span>{{ c('首') }}</span><span></span><span></span>
          <span></span><span>{{ c('首') }}</span><span>{{ c('頁') }}</span><span>{{ c('首') }}</span><span></span>
          <span>{{ c('首') }}</span><span>{{ c('頁') }}</span><span>{{ c('首') }}</span><span>{{ c('頁') }}</span><span>{{ c('首') }}</span>
          <span></span><span>{{ c('首') }}</span><span></span><span>{{ c('頁') }}</span><span></span>
          <span></span><span>{{ c('頁') }}</span><span></span><span>{{ c('首') }}</span><span></span>
        </div>
      </RouterLink>
      <RouterLink v-if="navigationStore.backPath" :to="navigationStore.backPath" :class="$style['back-button']" @click="($event.currentTarget as HTMLElement)?.blur()">
        <div :class="$style['back-logo']">
          <span></span><span></span><span>{{ c('上') }}</span><span></span><span></span><span></span>
          <span></span><span>{{ c('上') }}</span><span></span><span></span><span></span><span></span>
          <span>{{ c('上') }}</span><span>{{ c('一') }}</span><span>{{ c('頁') }}</span><span>{{ c('上') }}</span><span>{{ c('一') }}</span><span>{{ c('頁') }}</span>
          <span></span><span>{{ c('上') }}</span><span></span><span></span><span></span><span></span>
          <span></span><span></span><span>{{ c('上') }}</span><span></span><span></span><span></span>
        </div>
      </RouterLink>
    </div>
    <main :class="$style['rpg-ui']">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useNavigationStore } from './stores/navigation'

const navigationStore = useNavigationStore()
const route = useRoute()

const isChinese = computed(() => route.path.includes('/zh'))

function c(char: string): string {
  if (!char) return ''
  return isChinese.value ? char : '＊'
}
</script>

<style module>
.rpg-ui {
  border: 4px solid var(--border-color);
  box-shadow: 0 0 10px var(--border-color);
  padding-right: 8px;
  padding-left: 8px;
  width: 90%;
  min-width: 80vw;
  text-align: center;
}

.nav {
  display: flex;
  flex-direction: row;
  gap: 16px;
}

.home-button {
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  margin-bottom: 1rem;
  transition: transform 0.2s;
}

.home-button:hover {
  transform: scale(1.1);
}

.home-logo {
  display: inline-grid;
  grid-template-columns: repeat(5, 2ch);
  font-size: 12px;
  line-height: 1.4;
}

.home-logo span {
  text-align: center;
}

.back-button {
  display: inline-block;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  margin-bottom: 1rem;
  transition: transform 0.2s;
}

.back-button:hover {
  transform: scale(1.1);
}

.back-logo {
  display: inline-grid;
  grid-template-columns: repeat(6, 2ch);
  font-size: 12px;
  line-height: 1.4;
}

.back-logo span {
  text-align: center;
}
</style>
