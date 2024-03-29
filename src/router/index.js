import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

router.beforeEach(async (to, from) => {
  const isAuthenticated = localStorage.getItem('token')
  if (!isAuthenticated && to.name !== 'login') {
    // redirect the user to the login page
    return { name: 'login' }
  }
  if (isAuthenticated && to.name == 'login') {
    // redirect the user to the login page
    return { path: '/' }
  }
})

export default router
