<template>
  <div class="units__container">

    <table class="units__table" v-if="objects.length">
      <tr>
        <th>#</th>
        <th></th>
        <th>Name</th>
        <th>Last message</th>
        <th>Speed</th>
        <th>Number of sensors</th>

      </tr>
      <tr v-for="(object, index) in objects">
        <td>{{index + 1}}</td>
        <td><img v-bind:src="object.icon" width="25" height="25"></td>
        <td>{{object.name}}</td>
        <td>{{object.position}}</td>
        <td class="units__column">{{object.speed}}</td>
        <td>{{Object.keys(object.sensors).length}}</td>
        <td v-for="data in object.sensors">

{{data.n}}

        </td>

      </tr>
    </table>

    <span class="units__span">Всего объектов: {{getTotalCount}}</span>
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

console.log(this.datas)
</script>

<style>
  .units__span {
    color: red;
  }
  .units__table th {
    color: #939699;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 5px;
    font-weight: 400;
    font-size: 16px;
    text-align: left;
    vertical-align: top;
  }

  .units__column {

  }

  .cols-1 {
    width: 10%;
  }
  .cols-3 {
    width: 30%;
  }

</style>
