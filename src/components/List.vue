<template>
  <div class="units__container">
    <ul class="units__list">

      <li  v-for="person in people">
       {{person}}

      </li>
    </ul>
    <span class="units__span">Всего объектов: {{getTotalCount}}</span>
  </div>
</template>

<script>
export default {
  props: {
    people: {
      type: Array,
      required: false,
      dafault: []
    },
    employee: {
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
      return this.people.length;
    }
  }

}
</script>

<style>
  .units__span {
    color: red;
  }
</style>
