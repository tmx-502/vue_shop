import Vue from "vue";
import Router from "vue-router";
import Login from "../components/login.vue";
import Home from "../components/home.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    { path: "/", redirect: "../login" },
    { path: "/login", component: Login },
    { path: "/home", component: Home }
  ]
});

//挂载路由守卫
router.beforeEach((to, from, next) => {
  //next 路由函数
  if (to.path == "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
});

export default router;
