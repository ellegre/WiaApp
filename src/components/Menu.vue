<template>
  <nav class="screen-controls">
    <button v-on:click="changeState('default')" class="screen-controls__btn screen-controls__btn--active" id="table">Table</button>
    <button v-on:click="changeState('diagram')" class="screen-controls__btn" id="stat">Stats</button>
  </nav>
</template>

<script>
export default {

  data () {

    return {

    }
  },
  props: {
    state: String
  }
}
</script>

<style>
 .screen-controls {
  padding-top: 10px;
  padding-bottom: 10px;
}

.screen-controls__btn {
 width: 80px;
 cursor: pointer;
 padding: 10px;
 color: #fff;
 font-size: 20px;
 font-weight: 700;
 background-color: #078ff0;
 border: none;
}

.screen-controls__btn--active {
  text-decoration: underline;
  font-size: 22px;
}
</style>
