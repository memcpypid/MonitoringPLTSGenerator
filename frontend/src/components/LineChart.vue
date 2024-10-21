<template>
  <div class="line-chart-container">
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <Line :data="lineData" :options="lineOptions" />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

export default {
  components: {
    Line
  },
  props: {
    title: {
      type: String,
      default: 'Line Chart'
    },
    lineData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      lineOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Value: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Value'
            }
          }
        }
      }
    };
  }
};
</script>

<style scoped>
.line-chart-container {
  flex: 1;
}
</style>
