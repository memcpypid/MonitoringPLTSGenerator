<template>
    <div class="p-4 bg-white shadow rounded-lg">
      <h2 class="text-2xl font-semibold mb-4">Statistics Chart</h2>
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
  
  export default {
    components: {
      Bar
    },
    data() {
      return {
        chartData: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'My Dataset',
              backgroundColor: '#42A5F5',
              data: [40, 39, 10, 40, 39, 80, 40]
            }
          ]
        },
        chartOptions: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += `${context.parsed.y} units`;
                  }
                  return label;
                }
              }
            }
          }
        }
      };
    }
  };
  </script>
  

  