import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/HomeView.vue"

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register.vue"),
    meta: {
      requiresAuth: localStorage.getItem('isLoggedIn'),
    }
  },
  {
    path: "/event",
    name: "event",
    component: () => import("@/views/EventTable.vue"),
  },
  {
    path: "/team",
    name: "team",
    component: () => import("@/views/TeamTable.vue"),
  },
  {
    path: "/league",
    name: "league",
    component: () => import("@/views/LeagueTable.vue"),
  },
  {
    path: "/map",
    name: "map",
    component: () => import("@/components/GoogleMap.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach((to) => {
  if (to.meta.requiresAuth && (localStorage.getItem('isLoggedIn') === 'true')) {
    return { name: "Home", query: { redirect: to.fullPath } }
  }
})

export default router
