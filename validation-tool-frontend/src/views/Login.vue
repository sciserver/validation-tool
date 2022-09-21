<template>
  <v-container>
    <v-layout align-center justify-center column>
      <v-flex justify-center>
            <h2 align="left">Welcome to the  Validation Tool for the Democratizing Data project.</h2>
            <p align="left">
               Thank you for participating in this important effort to show the value of government data using automated tools.
            </p>
            <h3 align="left">Background</h3>
            <p align="left">
              Title II of the Evidence Act (Section 202(c)) requires agencies to "facilitate collaboration with non-Government entities (including businesses), researchers, 
              and the public for the purpose of understanding how data users value and use government data; engage the public in using public data assets of the agency 
              and encourage collaboration by publishing on the website of the agency, on a regular basis (not less than annually), 
              information on the usage of such assets by non-Government users; and assist the public in expanding the use of public data assets.            

              The Democratizing Data project has partnered with a number of agencies to develop machine learning ML models to automate the search and discovery of datasets 
              in scientific publications (more information is available here and here). You are being asked to validate the results of the ML models for one of the agencies participating in the effort.              
            </p>
            <v-row>
              <v-col cols="6">

                <h3 align="left">Details</h3>
                <p align="left">
                  The validation tool provides you with a number of text snippets containing a candidate phrase identified by the model. 
                  For each candidate phrase, you are asked to answer two questions:
                  <ul>
                    <li>
                      The first is to confirm whether the machine learning algorithm was correct in considering the phrase as a reference to a dataset in general.
                    </li>
                    <li>
                      The second is to confirm whether the dataset candidate was correctly matched to one of those dataset names provided by the agencies.
                    </li>
                  </ul>
                  You will be given a set of snippets to review initially, and additional snippets can be assigned upon request.
                </p>

              </v-col>
              <v-col cols="6">

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
                      <br>
                      <br>
                      <p align="left">
                        Email <a href="mailto:sciserver-helpdesk@jhu.edu">sciserver-helpdesk@jhu.edu</a> for questions.
                      </p>


                </v-flex>



              </v-col>
            </v-row>

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