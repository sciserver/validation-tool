import Vue from 'vue'
import Vuex from 'vuex'

import jwtDecode from '@/helpers/jwt-decode'
import { authService } from '@/services'

Vue.use(Vuex)

let currentToken = localStorage.getItem('token') || null
let currentUser = currentToken ? jwtDecode(currentToken) : null

// if token is expired
if (currentUser && currentUser.exp * 1000 < new Date().getTime()) {
  localStorage.removeItem('token')
  currentToken = null
  currentUser = null
}

export default new Vuex.Store({
  state: {
    token: currentToken,
    user: currentUser,
    isAdmin: false
  },
  actions: {
    login({ commit }, { username, password }) {
      commit('auth_request')
      return authService
        .authenticate(username, password)
        .then(resp => {
          const token = resp.access_token
          let payload = jwtDecode(token)
          const user = { ...payload }
          localStorage.setItem('token', token)
          commit('auth_success', { token, user })
        })
        .catch(err => {
          localStorage.removeItem('token')
          commit('auth_error', err)
        })
    },
    logout({ commit }) {
      localStorage.removeItem('token')
      commit('logout')
    },
  },
  mutations: {
    auth_request(state) {
      state.token = null
      state.user = null
    },
    auth_success(state, { token, user }) {
      state.token = token
      state.user = user
    },
    auth_error(state) {
      state.token = null
      state.user = null
    },
    logout(state) {
      state.token = null
      state.user = null
    },
  },
  getters: {
    isLoggedIn(state) {
      return state.token && state.user
    },
    isAdmin(state) {
      return state.user.privileges.some(p => p.roles.includes("ADMIN"));
    },
    token(state) {
      return state.token
    },
    user(state) {
      return state.user
    },
  }
})