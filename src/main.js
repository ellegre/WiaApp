import Vue from 'vue'
import App from './App.vue'
//import { BModal, VBModal } from 'bootstrap-vue'
//import BootstrapVue from 'bootstrap-vue'



//import 'bootstrap/dist/css/bootstrap.css';
//import 'bootstrap-vue/dist/bootstrap-vue.css';
//Vue.use(BootstrapVue);

//Vue.component('b-modal', BModal)

//Vue.directive('b-modal', VBModal)

import Filters from './components/Filters'
Vue.component('Filters', Filters)

import Menu from './components/Menu'
Vue.component('Menu', Menu)



new Vue({
  el: '#app',
  render: h => h(App)
})
