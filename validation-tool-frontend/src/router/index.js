import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  { path: '/login', component: () => import('@/views/Login.vue') },
  { path: '/logout', component: () => import('@/views/Logout.vue') },
  { path: '/review', component: () => import('@/views/Review.vue') },
  { path: '/about', component: () => import('@/views/About.vue') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/about', '/login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = store.getters.isLoggedIn

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})

export default router
