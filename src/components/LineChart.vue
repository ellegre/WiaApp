<script>
  import { Line, mixins } from 'vue-chartjs'


 export default {
    extends: Line,

    props:  {
      chartdata: {
      type: Object,
      default: null,
      objects: {
        type: Array,
        dafault: []
      },
    },
    options: {
      type: Object,
      default: null
      }
    },
    mounted () {
      this.renderChart(this.chartdata, this.options)
    }
  }

</script>

<style>
</style>
