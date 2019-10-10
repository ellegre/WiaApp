import Vue from 'vue'
import App from './App.vue'


import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';


import Filters from './components/Filters'
Vue.component('Filters', Filters)

import Menu from './components/Menu'
Vue.component('Menu', Menu)


new Vue({
  el: '#app',
  render: h => h(App)
})
