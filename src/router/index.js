import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Cashflow from "@/views/Cashflow.vue";
import Game100 from "@/views/Game100.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/game100",
      name: "game100",
      component: Game100,
    },
    {
      path: "/cashflow",
      name: "cashflow",
      component: Cashflow,
    },
    {
      path: "/gameone",
      name: "gameone",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/GameOne.vue"),
    },
  ],
});

export default router;
