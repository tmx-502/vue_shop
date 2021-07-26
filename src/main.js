/*
 * @Description:
 * @Author: liutq
 * @Date: 2021-07-22 09:10:57
 * @LastEditTime: 2021-07-26 11:53:54
 * @LastEditors: liutq
 * @Reference:
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import './plugins/element.js'
import './assets/CSS/global.css'
import './assets/CSS/iconfont.css'

import TreeTable from 'vue-table-with-tree-grid'
Vue.component('treeTable', TreeTable)

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
