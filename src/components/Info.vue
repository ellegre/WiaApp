<template>
  <div  v-if="info" class="info popup">
    <h1 class="info__title">App Name</h1>
    <p class="info__text">After the first entrance to the application, a list of objects will be displayed in the workspace.
      The list of objects is a table that contains relevant information on the objects. The following parameters are presented:
       plate number, speed, mileage, daily mileage, current position, fuel level, temperature, ignition state, first time ignition start of the day,
     current idling time, GPS status, vehicle status. </p>
     <p class="info__text">The information is updated every minute. The beginning of the working day is taken at 8 a.m.</p>

    <table class="info__table">
      <tr>
        <th>Indicator</th>
        <th>Description</th>
      </tr>
      <tr>
        <td>--</td>
        <td>No data available. Please check the information in <a href="https://hosting.wialon.com" target="_blank">Wialon system.</a></td>
      </tr>
        <td>N/S</td>
        <td>No sensor of this type. Please check the information in <span class="table__span">Unit Properties</span> in
          <a href="https://hosting.wialon.com" target="_blank">Wialon system.</a></td>
      <tr>
        <td>N/A</td>
        <td>Invalid value. For example, invalid or nonexistent sensor parameter, invalid math operations etc.</td>
      </tr>
    </table>
    <div class="info__container">
      <ul class="info__links">
        <a class="link__item" href="mailto:support@gurtam.com" target="_blank">Write us</a>
        <a class="link__item" href="https://forum.gurtam.com/" target="_blank">Forum to discuss</a>
      </ul>
      <button  tabindex="0" @keyup.esc="" v-on:click="onClose" type="button" class="popup__close">Close</button>
    </div>
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
  font-size: 16px;
  padding: 20px 30px;
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
  margin-bottom: 20px;
  padding-left: 20px;
  font-size: 16px;
  font-family: Arial;
  text-transform: uppercase;
  color: #DC143C;
  text-shadow: gray 2px 3px 4px;
  text-align: left;
  box-shadow: 0 4px 6px -6px #222;
}

.info__table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 30px;
  margin-top: 40px;
  border-bottom: 1px solid #E6E6E6;
}

.info__table td {
  text-align: center;
  padding: 10px;
  border-top: 1px solid #E6E6E6;
  width: 50%;
}

.info__table td:last-child {
  border-bottom: 1px solid #E6E6E6;
}

.table__span {
  font-weight: 700;
}

.info__table td ~ td {
  text-align: left;
}

.info__table th {
  text-align: center;
  padding: 10px;
}


.info__text {
  text-align: justify;
  font-size: 17px;
  line-height: 24px;

}

.info__span {
  display: inline-block;
  margin-bottom: 5px;
}

.info__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info__links {
  display: inline-block;
  padding: 0;
  margin: 0;
  margin-bottom: 20px;
}

.link__item {
  color: #078ff0;
  text-decoration: none;
  font-size: 12px;
}

.link__item:hover,
.link__item:focus {
  color: #2E2EFE;
  text-decoration: underline;
}

.popup__close {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 22px;
  box-sizing: border-box;
  font-size: 18px;
  width: 200px;
  cursor: pointer;
  background-color: 0099ff;
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
