<template>
  <v-container class="home" fluid>
    <p>
      Welcome to the validation tool of the <a href="https://coleridgeinitiative.org/show-us-the-data/">Show US the Data</a> project.<br>
      This tool is part of the Rich Context project and it's intended to review publication-dataset metadata. <br> 
      Please, log in if you are a reviewer to start the review process.
    </p>
  </v-container>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.home p {
  font-size: 20px;
  margin-top: 10px;
  padding: 0 40px;
}
</style>