<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 font-inter text-white px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
    <!-- Navbar Component -->
    <Navbar />

    <div class="max-w-7xl mx-auto mt-8">
      <!-- Top Controls and Status -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <!-- Monitoring Type Selection -->
        <div
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700">
          <label for="monitoringType" class="block text-sm sm:text-base font-semibold text-gray-200 mb-3">Pilih Tipe
            Monitoring</label>
          <select id="monitoringType" v-model="selectedType" @change="fetchData"
            class="block w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition duration-200 cursor-pointer">
            <option value="PLTS" class="bg-gray-700 text-white">PLTS</option>
            <option value="Generator" class="bg-gray-700 text-white">Generator</option>
          </select>
        </div>

        <!-- Chart Type Selection -->
        <div
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700">
          <label for="chartType" class="block text-sm sm:text-base font-semibold text-gray-200 mb-3">Pilih
            Grafik</label>
          <select id="chartType" v-model="selectedChart"
            class="block w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition duration-200 cursor-pointer">
            <option value="all" class="bg-gray-700 text-white">Semua</option>
            <option value="volt" class="bg-gray-700 text-white">Volt</option>
            <option value="ampere" class="bg-gray-700 text-white">Ampere</option>
            <option value="watt" class="bg-gray-700 text-white">Watt</option>
            <option value="energy" class="bg-gray-700 text-white">KWh</option>
            <option value="frequency" class="bg-gray-700 text-white">Frequency</option>
            <option value="powerfactor" class="bg-gray-700 text-white">PowerFactor</option>
            <option value="temp" class="bg-gray-700 text-white">Temperature</option>
            <option value="humidity" class="bg-gray-700 text-white">Humidity</option>
          </select>
        </div>

        <!-- Status Indicators -->
        <div
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700 flex flex-col justify-center space-y-4">
          <div class="flex items-center space-x-3">
            <span class="w-4 h-4 rounded-full flex-shrink-0"
              :class="{ 'bg-green-500': isGeneratorOnline, 'bg-red-500': !isGeneratorOnline }"></span>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-200">Status Generator: <span
                :class="{ 'text-green-400': isGeneratorOnline, 'text-red-400': !isGeneratorOnline }">{{
                  isGeneratorOnline ?
                    'Online' : 'Offline' }}</span></h1>
          </div>

          <div class="flex items-center space-x-3">
            <span class="w-4 h-4 rounded-full flex-shrink-0"
              :class="{ 'bg-green-500': isPLTSOnline, 'bg-red-500': !isPLTSOnline }"></span>
            <h1 class="text-lg sm:text-xl font-semibold text-gray-200">Status PLTS: <span
                :class="{ 'text-green-400': isPLTSOnline, 'text-red-400': !isPLTSOnline }">{{ isPLTSOnline ? 'Online' :
                  'Offline' }}</span></h1>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-extrabold text-center text-green-400 mb-8 tracking-wide">Data Monitoring Realtime</h2>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Each LineChart component is wrapped in a themed card for consistency -->
        <div v-if="showVoltChart"
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-700">
          <LineChart :title="`Volt (${selectedType})`" :lineData="voltData" />
        </div>
        <div v-if="showAmpereChart"
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-700">
          <LineChart :title="`Ampere (${selectedType})`" :lineData="ampereData" />
        </div>
        <div v-if="showWattChart"
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-700">
          <LineChart :title="`Watt (${selectedType})`" :lineData="wattData" />
        </div>
        <div v-if="showEnergyChart"
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-700">
          <LineChart :title="`KWh (${selectedType})`" :lineData="energyData" />
        </div>
        <div v-if="showFrequencyChart"
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-700">
          <LineChart :title="`Frequency (${selectedType})`" :lineData="frequencyData" />
        </div>
        <div v-if="showpowerfactorChart"
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-700">
          <LineChart :title="`Power Factor (${selectedType})`" :lineData="powerfactorData" />
        </div>
        <div v-if="showTempChart"
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-700">
          <LineChart :title="`Temperature (${selectedType})`" :lineData="tempData" />
        </div>
        <div v-if="showHumidityChart"
          class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-4 border border-gray-700">
          <LineChart :title="`Humidity (${selectedType})`" :lineData="humidityData" />
        </div>
      </div>
      <div
        class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-6 border border-gray-700 overflow-x-auto mb-6">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th v-for="header in tableHeaders" :key="header"
                class="py-3 px-4 text-xs font-semibold text-gray-300 uppercase tracking-wider text-center">
                {{ header }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            <tr v-if="rows.length === 0">
              <td colspan="10" class="text-center py-4 text-gray-400">No data available for today.</td>
            </tr>
            <tr v-for="row in paginatedRows" :key="row.time" class="hover:bg-gray-700 transition-colors">
              <td class="py-3 px-4 text-center text-gray-200">{{ row.voltage }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.current }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.power }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.energy }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.frequency }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.powerfactor }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.temperature }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.humidity }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.date }}</td>
              <td class="py-3 px-4 text-center text-gray-200">{{ row.time }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex flex-col sm:flex-row justify-between items-center mt-6 mb-12 space-y-4 sm:space-y-0">
        <button @click="prevPage" :disabled="currentPage === 1"
          class="py-2 px-4 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">Prev</button>
        <div class="flex items-center">
          <span class="mx-2 text-gray-300 text-sm sm:text-base">Page {{ currentPage }} of {{ totalPages }}</span>
          <select v-model="currentPage"
            class="p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 cursor-pointer">
            <option v-for="page in totalPages" :key="page" :value="page" class="bg-gray-700 text-white">Page {{ page }}
            </option>
          </select>
        </div>
        <button @click="nextPage" :disabled="currentPage === totalPages"
          class="py-2 px-4 bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200">Next</button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import LineChart from "../components/LineChart.vue";
import api from "@/services/api";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import Swal from 'sweetalert2';
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
      return this.createChartData('current', 'Ampere', '#FF9800');
    },
    wattData() {
      return this.createChartData('power', 'Watt', '#4CAF50');
    },
    energyData() {
      return this.createChartData('energy', 'KWh', '#9C27B0');
    },
    frequencyData() {
      return this.createChartData('frequency', 'Hz', '#00BCD4');
    },
    powerfactorData() {
      return this.createChartData('powerfactor', 'cosphi', '#FFC107');
    },
    tempData() {
      return this.createChartData('temperature', 'Temperature', '#F44336');
    },
    humidityData() {
      return this.createChartData('humidity', 'Humidity', '#42A5F5');
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
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      try {
        const responseGenerator = await api.getGeneratorDataLast()
        const responsePlts = await api.getPLTSDataLast();
        const Status = await api.GetStatus();
        this.isGeneratorOnline = Status.data.Generator.status === "Online"
        this.isPLTSOnline = Status.data.PLTS.status === "Online"
        const today = new Date().toISOString().split('T')[0];
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
        Swal.close();
      } catch (error) {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data!',
          text: error.message || 'Terjadi kesalahan saat mengambil data.',
        });
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
          tension: 0.2,
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
.font-inter {
  font-family: 'Inter', sans-serif;
}

.hover\:shadow-glow:hover {
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3), 0 0 45px rgba(0, 255, 0, 0.1);
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #333;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #0f9f30;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0a7d23;
}
</style>
