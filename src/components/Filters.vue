<template>
  <form class="unit-filters" action="#" method="get">
            <div class="unit-filters__filter">
              <input id="filter-all" class="unit-filters__filter-input  visually-hidden" type="radio" name="unit-filter" value="all" checked>
              <label class="trip-filters__filter-label" for="filter-all">{{all}}</label>
            </div>

            <div class="unit-filters__filter">
              <input id="filter-filter1" class="trip-filters__filter-input  visually-hidden" type="radio" name="unit-filter" value="filter1">
              <label class="unit-filters__filter-label" for="filter-filter1">Filter1</label>
            </div>

            <div class="unit-filters__filter">
              <input id="filter-filter2" class="unit-filters__filter-input  visually-hidden" type="radio" name="unit-filter" value="filter2">
              <label class="unit-filters__filter-label" for="ffilter-filter2">Filter2</label>
            </div>

            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>
</template>

<script>
export default {

  data () {
    return {
      all: `All`
    }
  }
}
</script>

<style scoped>
  .unit-filters {
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
}

.unit-filters__filter {
  width: 10%;
  color: #fff;
}

.unit-filters__filter:focus,
.unit-filters__filter:hover {
  color: #E6E6E6;
}
.visually-hidden {
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  border: 0;
}

</style>
