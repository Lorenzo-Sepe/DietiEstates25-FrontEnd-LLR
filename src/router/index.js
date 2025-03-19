import { createRouter, createWebHistory } from 'vue-router'

// Simulazione di un sistema di autenticazione
const isAuthenticated = () => {
  return false; // Esempio semplice
}

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
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/loginAgent',
    name: 'loginAgent',
    component: () => import('../views/LoginAgentView.vue')
  },
  { 
    path: '/PortaleAgenzia',
    name: 'PortaleAgenzia',
    component: () => import('../views/PortaleAgenzia.vue'),
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next({name:'MieiAnnunci'}); // L'utente è loggato, vai alla pagina dei miei annunci
      } else {
        next({ name: 'PortaleAgenziaInfo' }); // Reindirizza a una pagina informativa
      }
    }
  },
  {
    path: '/PortaleAgenziaInfo',
    name: 'PortaleAgenziaInfo',
    component: () => import('../views/PortaleAgenziaInfo.vue') // Pagina informativa sul portale
  },
  {
    path: '/PortaleAgenzia/miei-annunci',
    name: 'MieiAnnunci',
    component: () => import('../views/MieiAnnunci.vue'), // Pagina dei miei annunci
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next(); // L'utente è loggato, consenti l'accesso
      } else {
        next({ name: 'loginAgent' }); // Reindirizza alla pagina di login
      }
    }
  },
  {
    path: '/pannelloStaff',
    name: 'pannellStaff',
    component: () => import('../views/pannelloStaff.vue')

  },
  {
    path: '/pannelloStaff',
    name: 'pannellStaff',
    component: () => import('../views/pannelloStaff.vue')

  },
  {
    path: '/annuncio/:id',
    name: 'annuncio',
    component:()=> import('../views/DettagliAnnuncioView.vue')
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
  },
  {
    path: '/testrai',
    name: 'testRai',
    component: () => import('../views/TestRai.vue')
  }
]

// Crea l'istanza del router
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;