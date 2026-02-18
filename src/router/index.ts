import { createRouter, createWebHistory } from 'vue-router'
import LangView from '../views/LangView.vue'
import HomeView from '../views/HomeView.vue'
import { Lang } from '../constants/Lang'
import { setLocale } from '../i18n'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'choose-lang',
      component: LangView,
    },
    {
      path: '/:lang/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

const validLangs = new Set<string>(Object.values(Lang))

router.beforeEach(async (to) => {
  const lang = to.params.lang as string
  if (lang && validLangs.has(lang)) {
    await setLocale(lang as Lang)
  }
})

