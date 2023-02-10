import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
//引入字体文件
import './assets/font/iconfont.css'
import './assets/css/global.scss'
axios.defaults.baseURL = 'https://www.bookbook.cc/api'
Vue.prototype.$http = axios
Vue.prototype.$echarts = window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
