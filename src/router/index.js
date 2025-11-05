import { createRouter, createWebHistory } from "vue-router";
import { useStoreUtente } from "../stores/UserStore";
import { useEmployeeStore } from "../stores/EmployeeStore";
import { useUIStore } from "../stores/UiStore";


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
        meta: { requiresAuth: true, role: "employee" },

  },

  {
    path: "/PortaleAgenzia",
    name: "PortaleAgenzia",
    component: () => import("../views/PortaleAgenziaView.vue"),
  },
  
  {
    path: "/PortaleAgenzia/miei-annunci",
    name: "MieiAnnunci",
    component: () => import("../views/pannelloStaffView.vue"), // Pagina dei miei annunci
    meta: { requiresAuth: true, role: "employee" },

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
    meta: { requiresAuth: true, role: "employee" },
  },
  {
    path: "/annuncio/:id",
    name: "annuncio",
    component: () => import("../views/DettagliAnnuncioView.vue"),
  },
  {
    path: "/PortaleAgenzia/ModificaAnnuncio/:id",
    name: "modificaAnnuncio",
    component: () => import("../views/ModificaAnnuncio.vue"),
    meta: { requiresAuth: true, role: "employee" },
  },
  {
    path: "/notifiche",
    name: "notifiche",
    component: () => import("../views/NotificheView.vue"),
    meta: { requiresAuth: true  },
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

  {
    path: "/PortaleAgenzia/messaggi-promozionali",
    name: "messaggi-promozionali",
    component: () => import("../views/CreaNotificaView.vue"),
    meta: { requiresAuth: true, role: "employee" },
  },

  //ROUTE 404
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFoundView.vue"),
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


// Guardia globale per autenticazione
router.beforeEach((to, from, next) => {
  const storeUtente = useStoreUtente();
  const storeEmployee = useEmployeeStore();
  const uiStore = useUIStore();
  if (to.meta.requiresAuth) {
    let autenticato = false;
    let sessioneScaduta = false;
    if (to.meta.role === "employee") {
      autenticato = storeEmployee.isAutenticato;
      sessioneScaduta = storeEmployee.isSessioneScaduta;
    } else {
      autenticato = storeUtente.isAutenticato;
      sessioneScaduta = storeUtente.isSessioneScaduta;
    }
    if (autenticato) {
      // Se c'è un redirect predefinito (es. PortaleAgenzia → MieiAnnunci)
      if (to.meta.redirectTo) {
        next({ name: to.meta.redirectTo });
      } else {
        next();
      }
    } else {
     // Mostro popup login
      uiStore.showLoginModal = true;
      uiStore.loginRedirect = to.fullPath;
      uiStore.loginReason = sessioneScaduta ? "sessionExpired" : "authRequired";
      uiStore.loginRole = to.meta.role || "user";
      uiStore.fromPath = from.fullPath; // Salvo la pagina di provenienza
      uiStore.toPath = to.fullPath; // Salvo la pagina di destinazione
      
      next(from.fullPath); // Resta nella pagina corrente
    }
  } else {
    next();
  }
});


export default router;
