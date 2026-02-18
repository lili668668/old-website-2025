import { Lang } from '@/constants/Lang'
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: false,
  locale: Lang.ZH,
  fallbackLocale: Lang.EN,
})

const loadedLocales = new Set<Lang>()

export async function setLocale(locale: Lang) {
  if (!loadedLocales.has(locale)) {
    const messages = await import(`@/locales/${locale}.json`)
    i18n.global.setLocaleMessage(locale, messages.default)
    loadedLocales.add(locale)
  }
  i18n.global.locale.value = locale
}
