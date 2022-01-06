<template>
  <v-app>
    <v-app-bar class="header" color="grey darken-4" dense>
      <v-app-bar-title class="logo">Coleridge Initiative Validation Tool</v-app-bar-title>
      <v-btn class="ma-1 pa-1" text color="blue-grey lighten-4" to="/">Home</v-btn>
      <v-btn class="ma-1 pa-1" text color="blue-grey lighten-4" to="/about">About</v-btn>
      <v-spacer></v-spacer>
      <v-btn class="login-btn" color="blue-grey lighten-4" to="/login">Login</v-btn>
      <v-btn class="login-btn" color="blue-grey lighten-4" to="/logout">Logout</v-btn>
    </v-app-bar>
    <v-main class="fill-height">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    
  }),
  methods: {
    authenticated() {
      return false
    }
  }
}
</script>

<style>
#container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header .logo {
  color: white;
  font-weight: bold;
  font-size: 16px;
  padding-right: 10px;
}

.header .v-btn.v-size--default.login-btn {
  height: 30px;
}
</style>
