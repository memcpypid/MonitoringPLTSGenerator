<template>
  <Navbar />
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex flex-col items-center mb-6">
      <label for="monitoringType" class="text-gray-700 text-sm font-semibold mb-2">Pilih Tipe Monitoring</label>
      <select id="monitoringType" v-model="selectedType" @change="fetchData" class="form-select">
        <option value="PLTS">PLTS</option>
        <option value="Generator">Generator</option>
      </select>
    </div>

    <div class="flex flex-col items-center mb-6">
      <label for="chartType" class="font-semibold text-gray-700 text-sm mb-2">Pilih Grafik</label>
      <select id="chartType" v-model="selectedChart" class="form-select">
        <option value="all">Semua</option>
        <option value="volt">Volt</option>
        <option value="ampere">Ampere</option>
        <option value="watt">Watt</option>
        <option value="energy">KWh</option>
        <option value="frequency">Frequency</option>
        <option value="powerfactor">PowerFactor</option>
        <option value="temp">Temperature</option>
        <option value="humidity">Humidity</option>
      </select>
    </div>

    <div class="space-y-4">
      <div class="flex items-center space-x-2">
        <span class="status-indicator"
          :class="{ 'bg-green-500': isGeneratorOnline, 'bg-red-500': !isGeneratorOnline }"></span>
        <h1 class="status-text">Status Generator: <span
            :class="{ 'text-green-600': isGeneratorOnline, 'text-red-600': !isGeneratorOnline }">{{ isGeneratorOnline ?
              'Online' : 'Offline' }}</span></h1>
      </div>

      <div class="flex items-center space-x-2">
        <span class="status-indicator" :class="{ 'bg-green-500': isPLTSOnline, 'bg-red-500': !isPLTSOnline }"></span>
        <h1 class="status-text">Status PLTS: <span
            :class="{ 'text-green-600': isPLTSOnline, 'text-red-600': !isPLTSOnline }">{{ isPLTSOnline ? 'Online' :
            'Offline' }}</span></h1>
      </div>
    </div>

    <div class="flex flex-col items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Data Monitoring Realtime</h2>
    </div>


    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <LineChart v-if="showVoltChart" :title="`Volt (${selectedType})`" :lineData="voltData" />
      <LineChart v-if="showAmpereChart" :title="`Ampere (${selectedType})`" :lineData="ampereData" />
      <LineChart v-if="showWattChart" :title="`Watt (${selectedType})`" :lineData="wattData" />
      <LineChart v-if="showEnergyChart" :title="`KWh (${selectedType})`" :lineData="energyData" />
      <LineChart v-if="showFrequencyChart" :title="`Frequency (${selectedType})`" :lineData="frequencyData" />
      <LineChart v-if="showpowerfactorChart" :title="`Power Factor (${selectedType})`" :lineData="powerfactorData" />
      <LineChart v-if="showTempChart" :title="`Temperature (${selectedType})`" :lineData="tempData" />
      <LineChart v-if="showHumidityChart" :title="`Humidity (${selectedType})`" :lineData="humidityData" />
    </div>


    <div class="overflow-x-auto mb-6">
      <table class="min-w-full divide-y divide-gray-200 bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="header in tableHeaders" :key="header"
              class="text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-300 text-center">
              {{ header }}</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="rows.length === 0">
            <td colspan="10" class="text-center py-4">No data available for today.</td>
          </tr>
          <tr v-for="row in paginatedRows" :key="row.time" class="hover:bg-gray-50 transition-colors">
            <td class="text-center border-b border-gray-300">{{ row.voltage }}</td>
            <td class="text-center border-b border-gray-300">{{ row.current }}</td>
            <td class="text-center border-b border-gray-300">{{ row.power }}</td>
            <td class="text-center border-b border-gray-300">{{ row.energy }}</td>
            <td class="text-center border-b border-gray-300">{{ row.frequency }}</td>
            <td class="text-center border-b border-gray-300">{{ row.powerfactor }}</td>
            <td class="text-center border-b border-gray-300">{{ row.temperature }}</td>
            <td class="text-center border-b border-gray-300">{{ row.humidity }}</td>
            <td class="text-center border-b border-gray-300">{{ row.date }}</td>
            <td class="text-center border-b border-gray-300">{{ row.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>


    <div class="flex justify-between items-center mt-6 mb-12">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">Prev</button>
      <div class="flex items-center">
        <span class="mx-2 text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <select v-model="currentPage" class="pagination-select">
          <option v-for="page in totalPages" :key="page" :value="page">Page {{ page }}</option>
        </select>
      </div>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">Next</button>
    </div>
  </div>
  <Footer />
</template>

<script>
import LineChart from "../components/LineChart.vue";
import api from "@/services/allApi";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
export default {
  name: "HomePage",
  components: { LineChart, Navbar, Footer },
  data() {
    return {
      selectedType: "PLTS",
      selectedChart: "all",
      currentPage: 1,
      pageSize: 25,
      rows: [],
      isGeneratorOnline: false,
      isPLTSOnline: false,
      generatorlength: [],
      ptlslength: [],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.rows.length / this.pageSize);
    },
    paginatedRows() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.rows.slice(start, start + this.pageSize);
    },
    voltData() {
      return this.createChartData('voltage', 'Volt', '#42A5F5');
    },
    ampereData() {
      return this.createChartData('current', 'Ampere', '#FF5722');
    },
    wattData() {
      return this.createChartData('power', 'Watt', '#66BB6A');
    },
    energyData() {
      return this.createChartData('energy', 'KWh', '#66BB6A');
    },
    frequencyData() {
      return this.createChartData('frequency', 'Hz', '#66BB6A');
    },
    powerfactorData() {
      return this.createChartData('powerfactor', 'cosphi', '#66BB6A');
    },
    tempData() {
      return this.createChartData('temperature', 'Temperature', '#FF0000');
    },
    humidityData() {
      return this.createChartData('humidity', 'Humidity', '#0000FF');
    },
    showVoltChart() {
      return this.selectedChart === 'all' || this.selectedChart === 'volt';
    },
    showAmpereChart() {
      return this.selectedChart === 'all' || this.selectedChart === 'ampere';
    },
    showWattChart() {
      return this.selectedChart === 'all' || this.selectedChart === 'watt';
    },
    showEnergyChart() {
      return this.selectedChart === 'all' || this.selectedChart === 'energy';
    },
    showFrequencyChart() {
      return this.selectedChart === 'all' || this.selectedChart === 'frequency';
    },
    showpowerfactorChart() {
      return this.selectedChart === 'all' || this.selectedChart === 'powerfactor';
    },
    showTempChart() {
      return this.selectedChart === 'all' || this.selectedChart === 'temp';
    },
    showHumidityChart() {
      return this.selectedChart === 'all' || this.selectedChart === 'humidity';
    },
    tableHeaders() {
      return ["Volt", "Ampere", "Watt", "Energy(Kwh)", "Frequency(Hz)", "Power Factor", "Temperature", "Humidity", "Tanggal", "Jam"];
    }
  },
  methods: {
    async fetchData() {
      try {
        const responseGenerator = await api.getGeneratorData()
        const responsePlts = await api.getPLTSData();
        //console.log('API Response generator:', responseGenerator.data);
        //console.log('API Response PLTS :', responsePlts.data);

        const today = new Date().toISOString().split('T')[0];
       // console.log('Today:', today);

        const newRowsPlts = responsePlts.data
          .filter(item => item.timestamp)
          .map(item => {
            const dateObj = new Date(item.timestamp);
            return {
              voltage: item.voltage || 0,
              current: item.current || 0,
              power: item.power || 0,
              energy: item.energy || 0,
              frequency: item.frequency || 0,
              powerfactor: item.powerfactor || 0,
              temperature: item.temperature || 0,
              humidity: item.humidity || 0,
              date: dateObj.toISOString().split('T')[0],
              time: dateObj.toTimeString().split(' ')[0],
            };
          });
        const newRowsGenerator = responseGenerator.data
          .filter(item => item.timestamp)
          .map(item => {
            const dateObj = new Date(item.timestamp);
            return {
              voltage: item.voltage || 0,
              current: item.current || 0,
              power: item.power || 0,
              energy: item.energy || 0,
              frequency: item.frequency || 0,
              powerfactor: item.powerfactor || 0,
              temperature: item.temperature || 0,
              humidity: item.humidity || 0,
              date: dateObj.toISOString().split('T')[0],
              time: dateObj.toTimeString().split(' ')[0],
            };
          });

        if (this.selectedType === "Generator") {
          this.rows = newRowsGenerator.filter(row => row.date === today);
        } else {
          this.rows = newRowsPlts.filter(row => row.date === today);
        }

        if (this.generatorlength.length === newRowsGenerator.length) {
          this.isGeneratorOnline = false;
        } else {
          this.isGeneratorOnline = true;
        }

        if (this.ptlslength.length === newRowsPlts.length) {
          this.isPLTSOnline = false;
        } else {
          this.isPLTSOnline = true;
        }

        this.ptlslength = newRowsPlts.filter(row => row.date === today);
        this.generatorlength = newRowsGenerator.filter(row => row.date === today);

      } catch (error) {
        this.$toast.error(`Error : ${error}`, { position: "bottom-left", duration: 1000 });
      }
    },
    createChartData(key, label, color) {
      return {
        labels: this.rows.map(row => row.time),
        datasets: [{
          label,
          data: this.rows.map(row => row[key]),
          fill: false,
          borderColor: color,
          tension: 0.1,
        }],
      };
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  watch: {
    selectedType: 'fetchData',
    selectedChart() {
    }
  },
  mounted() {
    document.title = "Home";
    this.fetchData();
    this.dataFetchInterval = setInterval(this.fetchData, 30000);

  },
  beforeUnmount() {
    clearInterval(this.dataFetchInterval);
  },
};
</script>

<style scoped>
.form-select {
  width: 100%;
  max-width: 400px;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
}

.status-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.status-text {
  font-size: 1rem;
  font-weight: 600;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}

.pagination-button:disabled {
  background-color: #3b82f6;
  opacity: 0.5;
}

.pagination-select {
  margin-left: 0.5rem;
}
</style>
