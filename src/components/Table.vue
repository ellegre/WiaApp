<template>
  <div id="login-form">
    <b-container class="bv-example-row">
      <b-row>
        <b-col>1 of 3</b-col>
        <b-col>2 of 3</b-col>
        <b-col>3 of 3</b-col>
      </b-row>
      <b-row>
        <b-col cols="10">1 of 3</b-col>
        <b-col cols="2">2 of 3</b-col>
      </b-row>
      <hr>
      <b-row align-h="center">
        <b-col cols="4">
          <b-button size="lg" variant="sucsess">
           my button
          </b-button>
        </b-col>
        <b-col>One of three columns</b-col>
        <b-col>One of three columns</b-col>
      </b-row>

    </b-container>
    <div>
    <b-table  :items="items"></b-table>
  </div>
  </div>
</template>

<script>
  export default {

    name: 'login-form',
    data () {
        return {
          items: [
          { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { age: 38, first_name: 'Jami', last_name: 'Carney' }
        ]
        }
      }
    }
</script>
