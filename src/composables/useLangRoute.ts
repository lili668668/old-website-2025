import { useRoute } from 'vue-router'

export function useLangRoute() {
  const route = useRoute()
  const lang = route.params.lang as string
  const getPath = (subPath: string) => {
    return `/${lang}/${subPath}`
  }
  return { getPath, lang }
}
