import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/authentication.js'
import HomeView from '@/views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import AuthView from '@/views/AuthView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', component: HomeView, meta: { title: 'Home',  requireAuth: true }},
    {path: '/dashboard', component: DashboardView, meta: { title: 'Dashboard',  requireAuth: true }},
    {path: '/auth', component: AuthView, meta: { title: 'Authentication'}},
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (isAuthenticated()) {
      next() // allowed to access
    } else {
      next('/auth')
    }
  } else {
    next() // is not a protected routed
  }
})

export default router
