<template>
  <v-container>
    <v-layout align-center justify-center column>
      <v-flex justify-center>
            <p align="center">Welcome to the  Validation Tool project. Thank you for participating in this game-changing effort to show the value of public data using automated tools
            </p>
            <p align="center">
              You will be reviewing text snippets that have identified a reference to a dataset in a publication. You have two simple tasks for each snippet. The first is to confirm whether the machine learning algorithm was correct in finding the dataset reference.  The second is to confirm whether the dataset reference is to the dataset identified by the relevant agency.
            </p>
            <p align="center">
              You will be given up to 100 snippets to review initially, and then additional snippets in batches of 100.  
            </p>
            <p align="center">
If you have any questions, please email us at <a href="mailto:support@coleridgeinitiative.org">support@coleridgeinitiative.org</a>
            </p>
            <p align="center">
Login here to start the review process – and thank you so much for contributing to the public good.
              </p>
      </v-flex>
      <v-flex style="width:  400px;">
        <v-form ref="loginForm" @submit.prevent="authenticate">
          
          <v-card class="elevation-12">
            <v-toolbar dark color="blue-grey darken-2">
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <span style="color: red;" v-show="authError">Invalid Username or Password</span>
              <!-- <v-form> -->
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
              <!-- </v-form> -->
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn 
                color="blue-grey darken-2"
                dark 
                :loading="loginInProgress"
                type="submit"
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
    authError: false,
  }),
  created() {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push('/review')
    }
  },
  methods: {
    authenticate() {
      this.loginInProgress = true
      this.authError = false
      let username = this.username
      let password = this.password
      this.$store.dispatch('login', { username, password })
        .then(() => {
          this.loginInProgress = false
          if (this.$store.getters.isLoggedIn) {
            this.$router.push('/review')
          } else {
            // show login error
            this.authError = true
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