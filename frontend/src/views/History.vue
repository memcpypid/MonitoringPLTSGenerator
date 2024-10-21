<template>
  <Navbar/>
  
  <div class="p-6 bg-gray-100 min-h-screen flex flex-col">
    <h1 class="text-4xl font-bold mb-8 text-gray-600 justify-center flex">History</h1>

    <div class="flex flex-col sm:flex-row sm:justify-between mb-8 space-y-4 sm:space-y-0 sm:space-x-6">
      <div class="sm:w-1/3">
        <label for="historyDate" class="text-gray-700 text-sm font-medium mb-2 block">Pilih Tanggal</label>
        <input
          type="date"
          id="historyDate"
          v-model="selectedDate"
          @change="fetchHistoryData"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>


      <div class="sm:w-1/3">
        <label class="text-gray-700 text-sm font-medium mb-2 block">Pilih Tipe Data</label>
        <select
          v-model="selectedType"
          @change="fetchHistoryData"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="Generator">Generator</option>
          <option value="PLTS">PLTS</option>
        </select>
      </div>


      <div class="sm:w-1/3 flex items-end justify-end">
        <button
          @click="exportToExcel"
          :disabled="!rows.length"
          class="px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export to Excel
        </button>
      </div>
    </div>


    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-800">Data History Monitoring {{selectedType}}</h2>
    </div>


    <div class="flex-1 overflow-x-auto mb-8">
      <table class="min-w-full divide-y divide-gray-200 bg-white border border-gray-300 shadow-lg rounded-lg">
        <thead class="bg-indigo-100">
          <tr>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Volt</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Ampere</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Watt</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Energy(Kwh)</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Frequency(Hz)</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Power Factor</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Temperature</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Humidity</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Tanggal</th>
            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-300">Jam</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="!rows.length">
            <td colspan="9" class="text-center py-4 text-gray-500">Data tidak tersedia untuk tanggal dan tipe yang dipilih.</td>
          </tr>
          <tr v-else v-for="row in paginatedRows" :key="row.time" class="hover:bg-indigo-50 transition-colors">
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

    <div class="flex justify-between items-center mb-12">
      <div class="flex items-center">
        <label for="pageSelect" class="text-gray-700 text-sm font-medium mr-2">Page:</label>
        <select
          id="pageSelect"
          v-model="currentPage"
          @change="fetchHistoryData"
          class="block border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option v-for="page in totalPages" :key="page" :value="page">{{ page }}</option>
        </select>
      </div>

      <div>
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
  <Footer /> 
</template>


<script>
import api from "@/services/allApi";
import * as XLSX from "xlsx";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
export default {
  components:{
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
    }
  },
  methods: {
    async fetchHistoryData() {
      try {
        if (!this.selectedDate) return;

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

        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      } catch (error) {
        console.error('Error fetching history data:', error);
        this.rows=[]
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchHistoryData();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchHistoryData();
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
    currentPage() {
      this.fetchHistoryData();
    }
  },
};
</script>
