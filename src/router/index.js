import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'

// Definisci le tue rotte
const routes = [
  {
    path: '/',
    name: 'home',
    component: HelloWorld
  },
  {
    path: '/about',
    name: 'about',
    // Lazy loading del componente
    component: () => import('../views/AboutView.vue')
  }
]

// Crea l'istanza del router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 