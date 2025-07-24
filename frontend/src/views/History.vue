<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 font-inter text-white px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
    <!-- Navbar Component (Assuming it's imported and functional) -->
    <Navbar />

    <div class="max-w-7xl mx-auto mt-8">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-green-400 mb-8 tracking-wide">Data History
        Monitoring</h1>

      <div
        class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 p-6 sm:p-8 mb-8">
        <div class="flex flex-col sm:flex-row sm:justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <!-- Pilih Tanggal -->
          <div class="w-full sm:w-1/3">
            <label for="historyDate" class="block text-sm sm:text-base font-semibold text-gray-200 mb-2">Pilih
              Tanggal</label>
            <input type="date" id="historyDate" v-model="selectedDate" @change="fetchHistoryData"
              class="block w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition duration-200 cursor-pointer" />
          </div>

          <!-- Pilih Tipe Data -->
          <div class="w-full sm:w-1/3">
            <label for="dataType" class="block text-sm sm:text-base font-semibold text-gray-200 mb-2">Pilih Tipe
              Data</label>
            <select id="dataType" v-model="selectedType" @change="fetchHistoryData"
              class="block w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition duration-200 cursor-pointer">
              <option value="PLTS" class="bg-gray-700 text-white">PLTS</option>
              <option value="Generator" class="bg-gray-700 text-white">Generator</option>
            </select>
          </div>

          <!-- Export to Excel Button -->
          <div class="w-full sm:w-1/3 flex items-end justify-center sm:justify-end">
            <button @click="exportToExcel" :disabled="!rows.length"
              class="w-full sm:w-auto py-2 sm:py-3 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg class="inline-block w-5 h-5 mr-2 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Export to Excel
            </button>
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-semibold text-gray-200 mb-6 text-center">Data History Monitoring {{ selectedType }}</h2>

      <!-- Data Table Section -->
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
            <tr v-if="!rows.length">
              <td colspan="10" class="text-center py-4 text-gray-400">Data tidak tersedia untuk tanggal dan tipe yang
                dipilih.</td>
            </tr>
            <tr v-else v-for="row in paginatedRows" :key="row.time" class="hover:bg-gray-700 transition-colors">
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

      <!-- Pagination Controls -->
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
import api from "@/services/api";
import * as XLSX from "xlsx";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import Swal from 'sweetalert2';
export default {
  components: {
    Navbar,
    Footer
  },
  name: "HistoryPage",
  data() {
    return {
      selectedDate: '', // Date picker value
      selectedType: 'PLTS', // Default type
      rows: [], // All data for the selected date and type
      currentPage: 1, // Current page for pagination
      rowsPerPage: 20, // Number of rows per page
      totalPages: 1 // Total pages, initialized to 1
    };
  },
  computed: {
    paginatedRows() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      const end = start + this.rowsPerPage;
      return this.rows.slice(start, end);
    },
    tableHeaders() {
      return ["Volt", "Ampere", "Watt", "Energy(Kwh)", "Frequency(Hz)", "Power Factor", "Temperature", "Humidity", "Tanggal", "Jam"];
    }
  },
  methods: {
    async fetchHistoryData() {
      Swal.fire({
        title: 'Memuat data...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      try {
        if (!this.selectedDate) {
          this.selectedDate = new Date().toISOString().split('T')[0];
        }
        const response = await api.getHistoryData(this.selectedType, this.selectedDate);
        this.rows = response.data
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
        this.totalPages = Math.ceil(this.rows.length / this.rowsPerPage);
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.currentPage = this.totalPages;
        } else if (this.totalPages === 0) {
          this.currentPage = 1;
        }
        Swal.close();
      } catch (error) {
        Swal.close();
        this.rows = [];
        this.totalPages = 1;
        this.currentPage = 1;
        Swal.fire({
          icon: 'error',
          title: 'Gagal memuat data!',
          text: error.response.data.message || 'Terjadi kesalahan saat mengambil data.',
        });
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        // this.fetchHistoryData();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        // this.fetchHistoryData(); // Re-fetch data for the new page
      }
    },
    exportToExcel() {
      const ws = XLSX.utils.json_to_sheet(this.rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "History Data");
      XLSX.writeFile(wb, `History_Data_${this.selectedType}_${this.selectedDate}.xlsx`);
    }
  },
  watch: {
    selectedDate: {
      handler: 'fetchHistoryData',
      immediate: true
    },
    selectedType: 'fetchHistoryData',
    currentPage(newPage, oldPage) {
      if (newPage !== oldPage) {
        // this.fetchHistoryData();
      }
    }
  },
  mounted() {
    document.title = "History";
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
  /* Dark track */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #0f9f30;
  /* Green thumb */
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0a7d23;
  /* Darker green on hover */
}
</style>
