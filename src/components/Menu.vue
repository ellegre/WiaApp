<template>
  <nav class="screen-controls">
    <a class="screen-controls__btn screen-controls__btn--active" id="table" href="#">{{table}}</a>
    <a class="screen-controls__btn" id="stat" href="#">{{stats}}</a>
  </nav>
</template>

<script>
export default {

  data () {
    return {
      table: `Table`,
      stats: `Stats`
    }
  }
}
</script>

<style>
 .screen-controls {
  padding-top: 10px;
  padding-bottom: 10px;
}

.screen-controls__btn {
 display: inline-block;
 text-decoration: none;
 width: 10%;
 color: #fff;
 font-weight: 700;
}

.screen-controls__btn--active {
  text-decoration: underline;
  font-size: 22px;
}
</style>
