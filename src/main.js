import Vue from 'vue'
import App from './App.vue'
import { BModal, VBModal } from 'bootstrap-vue'
import BootstrapVue from 'bootstrap-vue'
import Chart from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"


import Menu from './components/Menu'
Vue.component('Menu', Menu)



new Vue({
  el: '#app',
  render: h => h(App)
})
