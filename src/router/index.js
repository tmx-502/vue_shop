/*
 * @Description:
 * @Author: liutq
 * @Date: 2021-07-22 09:10:57
 * @LastEditTime: 2021-07-26 21:13:27
 * @LastEditors: sueRimn
 * @Reference:
 */
import Vue from 'vue'
import Router from 'vue-router'


const Login = () =>
    import ( /* webpackChunkName: "Login-Home-welcome" */ '../components/login.vue')
const Home = () =>
    import ( /* webpackChunkName: "Login-Home-welcome" */ '../components/home.vue')
const welcome = () =>
    import ( /* webpackChunkName: "Login-Home-welcome" */ '../components/welcome.vue')
const user = () =>
    import ( /* webpackChunkName: "user" */ '../components/users/user.vue')
const rights = () =>
    import ( /* webpackChunkName: "rights-roles" */ '../components/power/rights.vue')
const roles = () =>
    import ( /* webpackChunkName: "rights-roles" */ '../components/power/roles.vue')
const categories = () =>
    import ( /* webpackChunkName: "add-categories-goods-params" */ '../components/commodity/categories.vue')
const params = () =>
    import ( /* webpackChunkName: "add-categories-goods-params" */ '../components/commodity/params.vue')
const goods = () =>
    import ( /* webpackChunkName: "add-categories-goods-params" */ '../components/commodity/goods.vue')
const add = () =>
    import ( /* webpackChunkName: "add-categories-goods-params" */ '../components/commodity/add.vue')
const orders = () =>
    import ( /* webpackChunkName: "orders" */ '../components/order/order.vue')
const reports = () =>
    import ( /* webpackChunkName: "reports" */ '../components/reports/reports.vue')

// import Login from '../components/login.vue'
// import Home from '../components/home.vue'
// import welcome from '../components/welcome.vue'
// import user from '../components/users/user.vue'
// import rights from '../components/power/rights.vue'
// import roles from '../components/power/roles.vue'
// import categories from '../components/commodity/categories.vue'
// import params from '../components/commodity/params.vue'
// import goods from '../components/commodity/goods.vue'
// import add from '../components/commodity/add.vue'
// import orders from '../components/order/order.vue'
// import reports from '../components/reports/reports.vue'

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