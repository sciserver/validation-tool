<template>
  <v-app>
    <v-app-bar class="header" color="grey darken-4" dense>
      <v-app-bar-nav-icon v-if="isLoggedIn && isAdmin" color="white" @click.stop="drawer = !drawer">
      </v-app-bar-nav-icon>
      <v-app-bar-title class="logo">Democratizing Data Validation Tool</v-app-bar-title>
      <v-btn class="ma-1 pa-1" text color="blue-grey lighten-4" to="/" v-show="false">Home</v-btn>
      <v-btn class="ma-1 pa-1" text color="blue-grey lighten-4" to="/about" v-show="false">About</v-btn>
      <!-- <v-btn class="ma-1 pa-1" text color="blue-grey lighten-4" to="/review" v-if="isLoggedIn">Review</v-btn> -->
      <v-spacer></v-spacer>
      <v-app-bar-title class="fullname" v-if="isLoggedIn">{{ loggedUserFullName }}</v-app-bar-title>
      <v-btn class="login-btn" color="blue-grey lighten-4" to="/login" v-if="!isLoggedIn && !isLoginPage">Login</v-btn>
      <v-btn class="login-btn" color="blue-grey lighten-4" to="/logout" v-if="isLoggedIn">Logout</v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item>
            <v-list-item-title @click="$router.push('/review')">Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title @click="$router.push('/dashboard')">Admin Dashboard</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main class="fill-height">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    currentRoute: null,
    drawer: false,
    group: 0,
  }),
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn
    },
    isAdmin() {
      console.log(this.$store.getters.isAdmin);
      return this.$store.getters.isAdmin
    },
    loggedUserFullName() {
      let user = this.$store.getters.user
      return user ? `${user.first_name} ${user.last_name}` : 'undefined'
    },
    isLoginPage() {
      return this.currentRoute && this.currentRoute.path === '/login'
    },
  },
  watch: {
    $route(to, from) {  // eslint-disable-line no-unused-vars
      this.currentRoute = to
    },
  },
}
</script>

<style>
header,
main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header .logo {
  color: white;
  font-weight: bold;
  font-size: 16px;
  padding-right: 10px;
}

.header .fullname {
  color: white;
  font-size: 16px;
  padding-right: 10px;
}

.header .v-btn.v-size--default.login-btn {
  height: 30px;
}
</style>
