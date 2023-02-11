import Vue from 'vue'
import VueRouter from 'vue-router'
import screenPage from '@/views/screenPage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
     redirect:'/screenPage'
  },
  {
    path: '/screenPage',
    name: 'screenPage',
    component: screenPage
  },

]

const router = new VueRouter({
  routes
})

export default router
