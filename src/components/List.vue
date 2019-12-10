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
        <th>Sensor total mileage</th>
        <th>Daily mileage, km</th>
        <th>Fuel level, l</th>
        <th>Temperature, °C</th>
        <th>Ignition, on/off</th>
        <th>Ignition first start</th>
        <th>Current idling time</th>
        <th>Moving state</th>
      </tr>
      <tr v-for="(object, index) in objects">
        <td>{{index + 1}}</td>
        <td><img v-bind:src="object.icon" width="25" height="25"></td>
        <td class="units__table--name">{{object.name}}</td>
        <td>{{object.plateNumber}}</td>
        <td class="units__table--message">{{object.lastMessage}}</td>
        <td class="units__table--position">{{object.address}}</td>
        <td v-bind:class="getClass(object.speed)">{{object.speed}}</td>
        <td>{{object.mileageCounter.toLocaleString()}}</td>
        <td>{{object.sensorMileage}}</td>
        <td>{{object.dailyMileage}}</td>
        <td v-bind:class="getClass(object.fuelLevel)">{{object.fuelLevel}}</td>
        <td v-bind:class="getClass(object.temperatureLevel)">{{object.temperatureLevel}}</td>
        <td v-bind:class="getClass(object.engineLevel)">{{object.engineLevel}}</td>
        <td></td>
        <td></td>
        <td v-bind:class="getMovingState(object.movingState)">
          <img v-if="getSvgSrc(object.movingState)" :src="getSvgSrc(object.movingState)" width="20">
          <span v-else>{{object.movingState}}</span>
        </td>
      </tr>
    </table>

    <span class="units__span">Total units count: {{getTotalCount}}</span>
  </div>
</template>

<script>
import MovingState from './MovingState'

export default {
  props: {
    objects: {
      type: Array,
      dafault: []
    }
  },
  data () {
    return {
      MovingState
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
    },
    getMovingState(value) {
      if (value == "YES") {
        return "green";
      }
    },
    getSvgSrc(value) {
      if (value == MovingState.YES) {
        return "./src/assets/arrow-green.png"
      }
      if (value == MovingState.NO) {
        return "./src/assets/arrow-black.png"
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
  color: gray;
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
