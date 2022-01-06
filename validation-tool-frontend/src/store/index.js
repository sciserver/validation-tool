import Vue from 'vue'
import Vuex from 'vuex'

import jwtDecode from '@/helpers/jwt-decode'
import { authService } from '@/services'

Vue.use(Vuex)

let currentToken = localStorage.getItem('token') || null
let currentUser  = currentToken ? jwtDecode(currentToken) : null

// if token is expired
if (currentUser.exp * 1000 < new Date().getTime()) {
  localStorage.removeItem('token')
  currentToken = null
  currentUser = null
}

export default new Vuex.Store({
  state: {
    //status: null,
    token: currentToken,
    user: currentUser,
  },
  actions: {
    login({commit}, { username, password }) {
      commit('auth_request')
      return authService
        .authenticate(username, password)
        .then(resp => {
          const token = resp.access_token
          let payload = jwtDecode(token)
          console.log(payload)
          const user = { ...payload }
          localStorage.setItem('token', token)
          commit('auth_success', token, user)
        })
        .catch(err => {
          localStorage.removeItem('token')
          commit('auth_error', err)
        })
    },
    logout({commit}) {
      localStorage.removeItem('token')
      commit('logout')
    },
  },
  mutations: {
    auth_request(state) {
      //state.status = 'loading'
      state.token = null
      state.user = null
    },
    auth_success(state, token, user) {
      //state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state) {
      //state.status = 'error'
      state.token = null
      state.user = null
    },
    logout(state) {
      //state.status = null
      state.token = null
      state.user = null
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.token && !!state.user
    },
    token(state) {
      return state.token
    }
  }
})