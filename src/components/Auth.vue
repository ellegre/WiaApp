<template>
  <iframe class="wialon__form" v-once v-bind:src="src"></iframe>
</template>
<script>
  export default {
    data () {
      return {
        src: "https://hosting.wialon.com/login.html?redirect_uri="
        + encodeURIComponent("http://localhost:8080/auth.html") + "&css_url="
        + encodeURIComponent("http://localhost:8080/src/assets/css/login-form.css")
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
      document.body.classList.add("body");
      window.updateToken = this.updateToken;
    }
  }
</script>
<style scoped>
  iframe {
    position: absolute;
    content: "";
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -220px;
    width: 600px;
    min-height: 420px;
    border: none;
  }

  .wialon__form {
    background-color: #ebebeb;
  }
</style>
