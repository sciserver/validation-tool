import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Logout from '@/views/Logout.vue'
import Review from '@/views/Review.vue'

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/logout', component: Logout },
  { path: '/review', component: Review },
  {
    path: '/about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
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
