<template>
  <div class="units__container">

    <table class="units__table" v-if="objects.length">
      <tr>
        <th>#</th>
        <th></th>
        <th class="units__table--name">Name</th>
        <th class="units__table--message">Last message</th>
        <th>Speed</th>
        <th>Number of sensors</th>
        <th>Total mileage, km</th>
        <th>Mileage of the day, km</th>
        <th>Address</th>
        <th>Plate number</th>
        <th>Fuel level, l</th>
        <th>Temperature, °C</th>
        <th>Ignition, on/off</th>
        <th>First time ignition start of the day</th>
        <th>Current idling time</th>
        <th>GPS status</th>
        <th>Vehicle status</th>
        <th>CAN-mileage total</th>
        <th>CAN Air Temperature</th>
        <th>CAN ignition</th>
        <th>CAN tacho</th>
        <th>CAN fuel level</th>
      </tr>
      <tr v-for="(object, index) in objects">
        <td>{{index + 1}}</td>
        <td><img v-bind:src="object.icon" width="25" height="25"></td>
        <td class="units__table--name">{{object.name}}</td>
        <td>{{object.position}}</td>
        <td>{{object.speed}}</td>
        <td>{{Object.keys(object.sensors).length}}</td>
        <td>{{object.mileageLevel}}</td>
        <td>{{object.dayMileage}}</td>
        <td>{{object.address}}</td>
        <td>{{object.plateNumber}}</td>
        <td class="units__table--fuel">{{object.fuelLevel}}</td>
        <td>{{object.temperatureLevel}}</td>
        <td>{{object.engineLevel}}</td>
        <td></td>
        <td></td>
        <td></td>
        <td>{{object.customFields}}</td>
        <td>{{object.canMileageLevel}}</td>
        <td>{{object.canAirTemperature}}</td>
        <td>{{object.canIgnition}}</td>
        <td>{{object.canTacho}}</td>
        <td>{{object.canFuelLevel}}</td>
        <td v-for="data in object.sensors">
          {{(data.n)}}
        </td>
      </tr>


    </table>

    <span class="units__span">Total units count: {{getTotalCount}}</span>
  </div>
</template>

<script>
export default {
  props: {
    objects: {
      type: Array,
      required: false,
      dafault: []
    }
  },
  data () {
    return {

    }
  },
  computed: {
    getTotalCount: function () {
      return this.objects.length;
    }
  }
}
</script>

<style>
.units__table {
  border-collapse: collapse;
  width: 100%;
}

.units__span {
  color: red;
  display: inline-block;
  padding-top: 10px;
  padding-bottom: 20px;
}

.units__table th {
  color: #939699;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 5px;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  vertical-align: top;
}

.units__table tr {
  text-align: center;

}

.units__table tr:nth-child(2n) {
  background-color: #F2F2F2;
}

.units__table tr:first-child {
  border-bottom: 1px solid gray;
}

.units__table--name {
  text-align: left;
}

.units__table .units__table--name {
  text-align: left
}

.units__table .units__table--message {
  text-align: left;
}
</style>
