import { createRouter, createWebHistory } from "vue-router";

// Simulazione di un sistema di autenticazione
const isAuthenticatedMember = () => {
  return true; // Esempio semplice
};
const isAuthenticatedEmployee = () => {
  return true; // Esempio semplice
};
//TODO ELIMARE ED USARE QUELLA PIU SPECIFICA
const isAuthenticated = () => {
  return true; // Esempio semplice
};

// Definisci le tue rotte
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/loginAgent",
    name: "loginAgent",
    component: () => import("../views/LoginAgentView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/RegistrationView.vue"),
  },
  {
    path: "/PortaleAgenzia/register-agency",
    name: "registerAgency",
    component: () => import("../views/AgencyRegistrationView.vue"),
  },

  {
    path: "/callback",
    name: "callback",
    component: () => import("../views/HomeView.vue"),
  },

  {
    path: "/PortaleAgenzia/creaPromozione",
    name: "NuovaPromozione",
    component: () => import("../views/CreaPromozioniView.vue"), // Pagina dei miei annunci
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next(); // L'utente è loggato, consenti l'accesso
      } else {
        next({ name: "loginAgent" }); // Reindirizza alla pagina di login
      }
    },
  },

  {
    path: "/PortaleAgenzia",
    name: "PortaleAgenzia",
    component: () => import("../views/PortaleAgenziaView.vue"),
    beforeEnter: (to, from, next) => {
      if (isAuthenticatedEmployee()) {
        next({ name: "MieiAnnunci" }); // L'utente è loggato, vai alla pagina dei miei annunci
      } else {
        next({ name: "registerAgency" }); // Reindirizza a una pagina informativa
      }
    },
  },
  {
    path: "/PortaleAgenziaInfo",
    name: "PortaleAgenziaInfo",
    component: () => import("../views/PortaleAgenziaInfo.vue"), // Pagina informativa sul portale
  },
  {
    path: "/PortaleAgenzia/miei-annunci",
    name: "MieiAnnunci",
    component: () => import("../views/pannelloStaffView.vue"), // Pagina dei miei annunci
    beforeEnter: (to, from, next) => {
      if (isAuthenticated()) {
        next(); // L'utente è loggato, consenti l'accesso
      } else {
        next({ name: "loginAgent" }); // Reindirizza alla pagina di login
      }
    },
  },

  {
    path: "/PortaleAgenzia/pannelloStaff",
    name: "pannellStaff",
    component: () => import("../views/pannelloStaffView.vue"),
  },
  {
    path: "/PortaleAgenzia/CreaAnnuncio",
    name: "CreaAnnuncio",
    component: () => import("../views/CreazioneAnnuncioView.vue"),
  },
  {
    path: "/annuncio/:id",
    name: "annuncio",
    component: () => import("../views/DettagliAnnuncioView.vue"),
  },
  {
    path: "/notifiche",
    name: "notifiche",
    component: () => import("../views/NotificheView.vue"),
  },

  {
    path: "/annunci",
    name: "annunci",
    component: () => import("../views/AnnunciView.vue"),
  },

  {
    path: "/mappa-annunci",
    name: "mappa-annunci",
    component: () => import("../views/RicercaAnnunciNellaMappaView.vue"),
  },

  //ROUTE 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
  },

  // Route di testing dei componenti
  {
    path: "/testLorenzo",
    name: "testL",
    component: () => import("../views/TestLorenzoView.vue"),
  },
  {
    path: "/test-roberto",
    name: "testR",
    component: () => import("../views/testRoby.vue"),
  },
  {
    path: "/testrai",
    name: "testRai",
    component: () => import("../views/TestRai.vue"),
  },
];

// Crea l'istanza del router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scrolla sempre in cima alla pagina
    return { top: 0 };
  },
});
export default router;
