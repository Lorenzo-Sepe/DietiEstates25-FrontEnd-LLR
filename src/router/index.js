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
  {
    path: '/loginAgent',
    name: 'loginAgent',
    component: () => import('../views/LoginAgentView.vue')

  },
  { 
    path:'/PortaleAgenzia',
    name: 'PortaleAgenzia',
    component: () => import('../views/PortaleAgenzia.vue')
  },
  {
    path: '/pannelloStaff',
    name: 'pannellStaff',
    component: () => import('../views/pannelloStaff.vue')

  },
  // Route di testing dei componenti
  {
    path: '/testLorenzo',
    name: 'testL',
    component: () => import('../views/TestLorenzoView.vue')
  },
  {
    path: '/test-roberto',
    name: 'testR',
    component: () => import('../views/testRoby.vue')
  }

]

// Crea l'istanza del router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 