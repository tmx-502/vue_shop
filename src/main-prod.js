/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-07-26 19:00:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-07-26 21:15:01
 */
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import axios from 'axios'
import nprogress from 'nprogress'
import router from './router'

import 'nprogress/nprogress.css'
// import './plugins/element.js'
import './assets/CSS/global.css'
import './assets/CSS/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('treeTable', TreeTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
    nprogress.start() /* 在request拦截器中展示进度条 */
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

axios.interceptors.response.use(config => {
    nprogress.done() /* 在response拦截器中隐藏进度条 */
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')