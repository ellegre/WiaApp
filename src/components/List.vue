<template>
  <div class="units__container">

    <table v-if="objects.length">
      <tr v-for="object in objects">
        <td>{{object.name}}</td>
        <td>{{object.position}}</td>
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
</style>
