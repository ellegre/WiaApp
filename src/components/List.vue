<template>
  <div class="units__container">

    <table class="units__table" v-if="objects.length">
      <tr>
        <th>#</th>
        <th></th>
        <th>Имя объекта</th>
        <th>Последнее сообщение</th>
        <th>Скорость</th>

      </tr>
      <tr v-for="(object, index) in objects">
        <td>{{index + 1}}</td>
        <td><img v-bind:src="object.icon" width="25" height="25"></td>
        <td>{{object.name}}</td>
        <td>{{object.position}}</td>
        <td>{{object.speed}}</td>


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
  .units__table th {
    color: #939699;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-right: 5px;
    font-weight: 400;
    font-size: 16px;
    text-align: left;
  }
  .cols-1 {
    width: 10%;
  }
  .cols-3 {
    width: 30%;
  }

</style>
