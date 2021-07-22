/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-06-22 21:32:45
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-07-21 23:32:39
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/CSS/global.css'
import './assets/CSS/iconfont.css'

import iView from 'iview'
import 'iview/dist/styles/iview.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('treeTable', TreeTable)

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(iView)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')