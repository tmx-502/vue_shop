/*
 * @Description:
 * @Author: liutq
 * @Date: 2021-07-22 09:10:57
 * @LastEditTime: 2021-07-26 09:15:03
 * @LastEditors: liutq
 * @Reference:
 */
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import user from '../components/users/user.vue'
import rights from '../components/power/rights.vue'
import roles from '../components/power/roles.vue'
import categories from '../components/commodity/categories.vue'
import params from '../components/commodity/params.vue'
import goods from '../components/commodity/goods.vue'
import add from '../components/commodity/add.vue'
import orders from '../components/order/order.vue'
import reports from '../components/reports/reports.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '../login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '/welcome', component: welcome },
        { path: '/users', component: user },
        { path: '/rights', component: rights },
        { path: '/roles', component: roles },
        { path: '/categories', component: categories },
        { path: '/params', component: params },
        { path: '/goods', component: goods },
        { path: '/add', component: add },
        { path: '/orders', component: orders },
        { path: '/reports', component: reports }
      ],
      redirect: '/welcome'
    }
  ]
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // next 路由函数
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
