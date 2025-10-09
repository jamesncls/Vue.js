import { createRouter, createWebHistory } from 'vue-router'
import BoardViewDraggable from '../views/BoardViewDraggable.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'board',
      component: BoardViewDraggable,
      meta: {
        title: 'Trello Clone - Board'
      }
    }
  ]
})

// Atualizar título da página
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
