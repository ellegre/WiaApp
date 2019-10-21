<template>
  <iframe v-once v-bind:src="src"></iframe>
</template>
<script>
  export default {
    data () {
      return {
        src: "https://hosting.wialon.com/login.html?redirect_uri="
        + encodeURIComponent("http://localhost:8080/auth.html")
      }
    },
    props: {
      onSuccess: Function
    },
    methods: {
      updateToken(token) {
        this.onSuccess(token);
      }
    },
    created(){
      window.updateToken = this.updateToken;
    }
  }
</script>
<style scoped>
  iframe {
    width: 600px;
    height: 440px;
  }
</style>
