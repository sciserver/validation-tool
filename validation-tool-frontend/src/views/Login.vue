<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-form ref="loginForm">
          <div class="welcome-text text-center">
            <p>Welcome to the Coleridge Initiative Validation Tool project. 
               Thank you for participating in this game-changing effort to show the value of public data using transparent processes using machine learning tools.
            </p>
            <p>
              You will be reviewing text snippets that have identified a reference to a dataset in a publication. 
              Your task for each snippet is to validate whether the machine learning algorithm was correct, and to match the reference to a known dataset.
            </p>
            <p>
              Login here to start the review process – and thank you so much for contributing to the public good.
            </p>
          </div>
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
    username: '',
    password: '',
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

<style scoped>
.welcome-text {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.welcome-text p {
  font-size: 20px;
  margin-top: 10px;
  padding: 0 40px;
}
</style>