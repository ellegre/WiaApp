<template>
  <div class="units__container">

    <table class="units__table" v-if="objects.length">
      <tr>
        <th></th>
        <th>Имя объекта</th>
        <th>Последнее сообщение</th>
        <th>Id</th>
        <th>Скорость</th>
        <th>Сенсоры</th>
      </tr>
      <tr v-for="object in objects">
        <td class="cols-1"><img v-bind:src="object.icon"></td>
        <td class="cols-3">{{object.name}}</td>
        <td>{{object.position}}</td>
        <td>{{object.id}}</td>
        <td>{{object.speed}}</td>
        <td>{{object.address}}</td>
        <td>{{object.sensor}}</td>
        <td>{{object.sensorres}}</td>
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
  },
  methods: {

  }
}

</script>

<style>
  .units__span {
    color: red;
  }
  .units__table {

  }
  .cols-1 {
    width: 10%;
  }
  .cols-3 {
    width: 30%;
  }
</style>
