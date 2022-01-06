<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
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
              @click="authenticate"
              :loading="loginInProgress"
            >Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  data: () => ({
      username: null,
      password: null,
      loginInProgress: false,
  }),
  methods: {
      authenticate() {
          this.loginInProgress = true;
          console.log(this.username)
          console.log(this.password)
          //setTimeout(() => {this.loginInProgress = false}, 3000)
          return false;
      },
  }
};
</script>