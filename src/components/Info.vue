<template>
  <div  v-if="info" class="info popup">
    <img src="../assets/sponge.png" class="popup__avatar" width="45" height="45" alt="Изображение">
    <p class="info__text">After the first entrance to the application, a list of objects will be displayed in the workspace. The information in the application is updated every minute.
      The list of objects is a table that contains relevant information on the objects. The following parameters are presented:</p>
    <ul>
      <li>speed</li>
      <li>mileage</li>
      <li>daily mileage</li>
      <li>current address</li>
      <li>plate number</li>
      <li>fuel level</li>
      <li>temperature</li>
      <li>ignition state</li>
      <li>first time ignition start of the day</li>
      <li>current idling time</li>
      <li>GPS status</li>
      <li>vehicle status</li>
    </ul>
    <button v-on:click="onClose" type="button" class="popup__close">Close</button>
  </div>
</template>

<script>
export default {
  props: {
    info: Boolean,
    onClose: Function
  }
}
</script>

<style>


.popup__close {
  margin-top: 0 auto;
  padding: 15px 10px;
  box-sizing: border-box;
  font-size: 18px;
  width: 200px;
  cursor: pointer;
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
