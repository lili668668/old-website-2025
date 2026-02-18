import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', () => {
  const backPath = ref<string | null>(null)

  function setBackPath(path: string | null) {
    backPath.value = path
  }

  return { backPath, setBackPath }
})
