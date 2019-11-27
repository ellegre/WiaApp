<template>
  <div class="units__container">

    <table class="units__table" v-if="objects.length">
      <tr>
        <th>#</th>
        <th></th>
        <th>Name</th>
        <th>Plate number</th>
        <th>Last message</th>
        <th>Position</th>
        <th>Speed, km/h</th>
        <th>Total mileage, km</th>
        <th>Daily mileage, km</th>
        <th>Fuel level, l</th>
        <th>Temperature, °C</th>
        <th>Ignition, on/off</th>
        <th>Ignition first start</th>
        <th>Current idling time</th>
        <th>GPS status</th>
      </tr>
      <tr v-for="(object, index) in objects">
        <td>{{index + 1}}</td>
        <td><img v-bind:src="object.icon" width="25" height="25"></td>
        <td class="units__table--name">{{object.name}}</td>
        <td>{{object.plateNumber}}</td>
        <td class="units__table--message">{{object.lastMessage}}</td>
        <td class="units__table--position">{{object.address}}</td>
        <td v-bind:class="getClass(object.speed)">{{object.speed}}</td>
        <td>{{object.mileageCounter}}</td>
        <td>{{object.dayMileage}}</td>
        <td v-bind:class="getClass(object.fuelLevel)">{{object.fuelLevel}}</td>
        <td v-bind:class="getClass(object.temperatureLevel)">{{object.temperatureLevel}}</td>
        <td v-bind:class="getClass(object.engineLevel)">{{object.engineLevel}}</td>
        <td></td>
        <td>{{object.customFields}}</td>
        <td>{{object.canMileageLevel}}</td>
        <td>{{object.canAirTemperature}}</td>
        <td>{{object.canIgnition}}</td>
        <td>{{object.canFuelLevel}}</td>
        <!--<td v-for="data in object.sensors">
          {{(data.t)}}
        </td>-->
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
      dafault: []
    }
  },
  data () {
    return {

    }
  },
  methods: {
    getClass(value) {
      if (Number.isFinite(value) || value == "off") {
         return "black";
       }
      if (value == "on") {
        return "green";
      }

      if (value == "N/A" || "N/S") {
        return "gray";
      }
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

.black {
  color: #000;
}

.gray {
  color: #A4A4A4;
}

.green {
  color: #01DF01;
  font-weight: 700;
}

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

.units__table tr:first-child,
.units__table tr:last-child {
  border-bottom: 1px solid gray;
}

.units__table .units__table--name,
.units__table .units__table--position,
.units__table .units__table--message {
  text-align: left;
}

</style>
