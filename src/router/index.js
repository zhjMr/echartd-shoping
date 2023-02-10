import Vue from 'vue'
import VueRouter from 'vue-router'
import sellerPage from '@/views/sellerPage.vue'
import trendPage from '@/views/trendPage.vue'
import mapPage from '@/views/mapPage.vue'
import rankPage from '@/views/rankPage.vue'
import hotPage from '@/views/hotPage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'sellerPage',
    component: sellerPage
  },
  {
    path: '/trendPage',
    name: 'trendPage',
    component: trendPage
  },
  {
    path: '/mapPage',
    name: 'mapPage',
    component: mapPage
  },
  {
    path: '/rankPage',
    name: 'rankPage',
    component: rankPage
  },
  {
    path: '/hotPage',
    name: 'hotPage',
    component: hotPage
  },

]

const router = new VueRouter({
  routes
})

export default router
