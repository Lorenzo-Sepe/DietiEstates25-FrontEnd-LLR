import { createRouter, createWebHistory } from 'vue-router'

// Definisci le tue rotte
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // Lazy loading del componente
    component: () => import('../views/AboutView.vue')
  },
  // Route di testing dei componenti
  {
    path: '/testLorenzo',
    name: 'testL',
    component: () => import('../views/TestLorenzoView.vue')
  }

]

// Crea l'istanza del router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 