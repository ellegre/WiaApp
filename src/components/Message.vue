<template>
  <div v-if="message" class="message popup">
    <img src="../assets/sponge.png" class="popup__avatar" width="45" height="45" alt="Изображение">
    <p class="message__text">{{message}}. Please reload the page.</p>
    <button v-on:click="onClose" type="button" class="popup__close">Close</button>
  </div>
</template>

<script>
export default {
  props: {
    message: String,
    onClose: Function
  }
}
</script>

<style>
.message {
  width: 500px;
  height: 200px;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -300px;
  margin-top: -220px;
  content: "";
  text-align: center;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  background-color: #fff;
}

.message__text {
  font-size: 18px;
  margin: 0;
  padding: 10px;
  margin-bottom: 35px;

}

.popup__close {
  margin-top: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  font-size: 18px;
  width: 180px;
  cursor: pointer;
  border-radius: 22px;
  background-color: #E3F6CE;
}

.popup__close:hover,
.popup__close:focus {
  background-color: #D0F5A9;
}

.popup__close:active {
  background-color: #BEF781;
  outline: none;
}
</style>
