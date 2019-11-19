<template>
  <div  v-if="info" class="info popup">
    <h1 class="info__title">App Name</h1>
    <p class="info__text">After the first entrance to the application, a list of objects will be displayed in the workspace. The information in the application is updated every minute.
      The list of objects is a table that contains relevant information on the objects. The following parameters are presented:</p>
    <ul class="info__list">
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

.info {
  width: 1000px;
  font-size: 18px;
  min-height: 400px;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -500px;
  margin-top: -312px;
  content: "";
  text-align: center;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  background-color: #fff;
}

.info__title {
  padding: 20px;
  margin: 0;
  padding-left: 20px;
  font-size: 16px;
  font-family: Arial;
  text-transform: uppercase;
  color: #DC143C;
  text-shadow: gray 2px 3px 4px;
  text-align: left;
  box-shadow: 0 4px 6px -6px #222;
}

.info__text {
  padding-bottom: 20px;
  text-align: justify;
  font-size: 18px;
  text-indent: 20px;
}

.info__list {
  text-align: justify;
}

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
