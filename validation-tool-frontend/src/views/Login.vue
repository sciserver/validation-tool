<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-form ref="loginForm">
          <v-card class="elevation-12">
            <v-toolbar dark color="blue-grey darken-2">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  prepend-icon="mdi-account-circle"
                  name="username"
                  label="Username"
                  type="text"
                  v-model="username"
                ></v-text-field>
                <v-text-field
                  id="password"
                  prepend-icon="mdi-lock"
                  name="password"
                  label="Password"
                  type="password"
                  v-model="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="blue-grey darken-2" 
                dark 
                :loading="loginInProgress"
                @click="authenticate"
              >Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
    username: 'validation@tool.test',
    password: 'Password123@#',
    loginInProgress: false,
  }),
  created() {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push('/review')
    }
  },
  methods: {
    authenticate() {
      this.loginInProgress = true
      let username = this.username
      let password = this.password
      this.$store.dispatch('login', { username, password })
        .then(() => {
          this.loginInProgress = false
          if (this.$store.getters.isLoggedIn) {
            this.$router.push('/review')
          } else {
            // show login error
            console.log('LOGIN ERROR')
          }
        })
    },
  }
};
</script>