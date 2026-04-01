<template>
  <Teleport to="body">
    <div v-if="open" :class="$style.backdrop" @click.self="$emit('close')">
      <div :class="[$style.dialog, dense && $style.dense]" role="dialog" :aria-modal="true">
        <div :class="$style.header">
          <p v-if="title" :class="$style.title">{{ title }}</p>
          <button
            :class="[$style.closeBtn, dense && $style.denseBtn]"
            @click="$emit('close')"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  open: boolean
  title?: string
  dense?: boolean
}>()

const emit = defineEmits<{ close: [] }>()

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style module>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}

.dialog {
  background: var(--bg-color, #1a1a1a);
  border: 1px solid var(--dialog-color);
  padding: 28px;
  max-width: 640px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.title {
  font-family: var(--font-family);
  font-size: var(--title-font-size);
  color: var(--accent-color);
  margin: 0;
}

.closeBtn {
  background: none;
  border: 1px solid var(--dialog-color);
  color: var(--dialog-color);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: auto;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.denseBtn {
  padding: 2px;
}

.closeBtn:hover {
  opacity: 1;
}

.dense {
  padding: 14px;
  gap: 8px;
  max-width: 320px;
}
</style>
