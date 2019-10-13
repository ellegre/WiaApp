<template>
  <div class="indicator-container">
    <button class="indicator__btn">Сообщения</button>
    <button class="indicator__btn">Потрачено топлива</button>
    <button class="indicator__btn">Средний расход</button>
    <button class="indicator__btn">Нач. уровень</button>
    <button class="indicator__btn">Кон. уровень</button>
  </div>

</template>

<script>
export default {

  data () {
    return {


    }
  },
  computed: {

  }
}
</script>

<style>
  .indicator-container {
    display: flex;
    justify-content: space-around;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .indicator__btn {
    border-radius: 10px;
    font-family: Arial;
  }
</style>
