<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 font-inter text-white px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
        <Navbar />

        <div class="max-w-5xl mx-auto mb-32 mt-10">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-green-400 mb-8 tracking-wide">Hasil Panen
                Mingguan</h1>

            <!-- Filter Bulan & Tahun -->
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                <div class="w-full sm:w-1/2">
                    <label class="block text-gray-200 mb-1">Pilih Tahun</label>
                    <select v-model="selectedYear" @change="fetchData"
                        class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                    </select>
                </div>
                <div class="w-full sm:w-1/2">
                    <label class="block text-gray-200 mb-1">Pilih Bulan</label>
                    <select v-model="selectedMonth" @change="fetchData"
                        class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                        <option v-for="(month, index) in monthNames" :key="index" :value="index">{{ month }}</option>
                    </select>
                </div>
            </div>

            <!-- Chart -->
            <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg mb-8">
                <h2 class="text-xl font-semibold text-center mb-4 text-white">Grafik Panen Mingguan (Ton)</h2>
                <Bar :data="chartData" :options="chartOptions" />
            </div>

            <!-- Table -->
            <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
                <h2 class="text-xl font-semibold text-center mb-4 text-white">Tabel Data Panen</h2>
                <table class="w-full text-sm divide-y divide-gray-600 text-center">
                    <thead class="bg-gray-700 text-gray-300">
                        <tr>
                            <th class="px-4 py-2">Minggu</th>
                            <th class="px-4 py-2">Jumlah Panen (Ton)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in weeklyData" :key="item.week" class="hover:bg-gray-700 transition">
                            <td class="py-2">Minggu ke-{{ item.week }}</td>
                            <td class="py-2">{{ item.ton.toFixed(2) }}</td>
                        </tr>
                        <tr v-if="weeklyData.length === 0">
                            <td colspan="2" class="text-gray-400 py-4">Belum ada data untuk bulan ini.</td>
                        </tr>
                    </tbody>
                </table>

                <div class="text-right mt-4">
                    <button @click="exportToExcel"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
                        Ekspor ke Excel
                    </button>
                </div>
            </div>
        </div>

        <Footer />
    </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import * as XLSX from "xlsx";
import api from "@/services/api";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from "chart.js";

import { Bar } from "vue-chartjs";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
    name: "HasilPanen",
    components: { Navbar, Footer, Bar },
    data() {
        return {
            selectedYear: new Date().getFullYear(),
            selectedMonth: new Date().getMonth(),
            availableYears: [],
            monthNames: [
                "Januari", "Februari", "Maret", "April", "Mei", "Juni",
                "Juli", "Agustus", "September", "Oktober", "November", "Desember"
            ],
            weeklyData: [],
        };
    },
    computed: {
        chartData() {
            return {
                labels: this.weeklyData.map(item => `Minggu ke-${item.week}`),
                datasets: [
                    {
                        label: "Jumlah Panen (Ton)",
                        backgroundColor: "#22c55e",
                        data: this.weeklyData.map(item => item.ton)
                    }
                ]
            };
        },
        chartOptions() {
            return {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: "#ffffff" }
                    },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) label += `${context.parsed.y} ton`;
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: "#ffffff" }
                    },
                    x: {
                        ticks: { color: "#ffffff" }
                    }
                }
            };
        }
    },
    methods: {
        populateYears() {
            const now = new Date().getFullYear();
            for (let y = 2024; y <= now; y++) this.availableYears.push(y);
        },
        async fetchData() {
            try {
                const res = await api.GetAllPanen({
                    year: this.selectedYear,
                    month: this.selectedMonth
                });
                this.weeklyData = res.data;
            } catch (err) {
                console.error("Gagal mengambil data:", err);
            }
        },
        exportToExcel() {
            const wsData = [["Minggu", "Jumlah Panen (Ton)"]];
            this.weeklyData.forEach(item => {
                wsData.push([`Minggu ke-${item.week}`, item.ton]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(wsData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Hasil Panen");
            XLSX.writeFile(workbook, `hasil-panen-${this.selectedMonth + 1}-${this.selectedYear}.xlsx`);
        }
    },
    mounted() {
        document.title = "Hasil Panen Mingguan";
        this.populateYears();
        this.fetchData();
    }
};
</script>



<style scoped>
.font-inter {
    font-family: 'Inter', sans-serif;
}
</style>