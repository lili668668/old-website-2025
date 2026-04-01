<template>
  <div>
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="$style.option"
      @mouseenter="emit('update:modelValue', index)"
      @click="emit('confirm', index)"
    >
      <span :class="$style.cursor">{{ index === modelValue ? '>' : ' ' }}</span>
      <span v-if="item.key" :class="$style.key">[{{ item.key }}]</span>
      <span :class="$style.label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Item {
  label: string
  key?: string
}

const props = defineProps<{
  items: Item[]
  modelValue: number
}>()

const emit = defineEmits<{
  'update:modelValue': [index: number]
  confirm: [index: number]
}>()

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'w') {
    event.preventDefault()
    emit('update:modelValue', (props.modelValue - 1 + props.items.length) % props.items.length)
  } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 's') {
    event.preventDefault()
    emit('update:modelValue', (props.modelValue + 1) % props.items.length)
  } else if (event.key === 'Enter') {
    emit('confirm', props.modelValue)
  } else {
    const num = parseInt(event.key)
    if (!isNaN(num) && num >= 1 && num <= props.items.length) {
      const index = num - 1
      emit('update:modelValue', index)
      emit('confirm', index)
    }
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style module>
.option {
  display: flex;
  align-items: center;
  margin: 4px 0;
  padding: 8px 0;
  transition: background 0.1s;
  cursor: pointer;
}

.option:hover {
  background: rgba(51, 255, 51, 0.1);
}

.cursor {
  color: #ffff00;
  margin-right: 8px;
  display: inline-block;
  width: 16px;
  animation: blink 1s infinite;
}

.key {
  color: #ff6600;
  margin-right: 12px;
}

.label {
  color: var(--accent-color);
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}
</style>
