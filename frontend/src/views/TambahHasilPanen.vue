<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 font-inter text-white px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
        <Navbar />

        <div class="max-w-5xl mx-auto mt-8 mb-80">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-green-400 mb-8 tracking-wide">Tambah Data
                Panen
                Mingguan (Ton)</h1>

            <!-- Filter Bulan & Tahun -->
            <div class="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <div class="w-full sm:w-1/2">
                    <label class="block text-gray-200 mb-1">Pilih Tahun</label>
                    <select v-model="selectedYear" @change="fetchWeeklyData"
                        class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500">
                        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
                    </select>
                </div>
                <div class="w-full sm:w-1/2">
                    <label class="block text-gray-200 mb-1">Pilih Bulan</label>
                    <select v-model="selectedMonth" @change="fetchWeeklyData"
                        class="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500">
                        <option v-for="(month, index) in monthNames" :key="index" :value="index">{{ month }}</option>
                    </select>
                </div>
            </div>

            <!-- Form Input -->
            <div class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 mb-8">
                <h2 class="text-xl font-semibold mb-4 text-gray-300">Input Panen Mingguan (Ton)</h2>
                <form @submit.prevent="handleSubmit">
                    <div class="flex flex-col sm:flex-row gap-4 mb-4">
                        <select v-model="formData.week"
                            class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-green-500"
                            required>
                            <option disabled value="">Pilih Minggu ke-</option>
                            <option v-for="week in weeksInMonthDetailed" :key="week.week" :value="week.week">
                                Minggu ke-{{ week.week }} ({{ week.start }}–{{ week.end }} {{ monthNames[selectedMonth]
                                }})
                            </option>
                        </select>

                        <input type="number" step="0.01" v-model="formData.ton" placeholder="Jumlah Panen (Ton)"
                            class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:ring-green-500"
                            required />
                    </div>
                    <button type="submit"
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">Simpan</button>
                </form>
            </div>

            <!-- Table -->
            <div class="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h2 class="text-xl font-semibold mb-4 text-gray-300 text-center">Tabel Panen Mingguan</h2>
                <table class="min-w-full divide-y divide-gray-700 text-sm">
                    <thead>
                        <tr class="bg-gray-700 text-gray-300 uppercase text-center">
                            <th class="px-4 py-2">Minggu</th>
                            <th class="px-4 py-2">Jumlah Panen (Ton)</th>
                            <th class="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="text-center">
                        <tr v-for="(entry, index) in weeklyData" :key="index" class="hover:bg-gray-700 transition">
                            <td class="py-2">{{ getWeekLabel(entry.week) }}</td>

                            <td class="py-2">{{ entry.ton.toFixed(2) }}</td>
                            <td class="py-2 flex justify-center gap-2">
                                <button @click="editEntry(index)"
                                    class="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-md transition duration-200 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M11 5h2M12 4v16m4-4H8" />
                                    </svg>
                                    Edit
                                </button>

                                <button @click="deleteEntry(index)"
                                    class="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition duration-200 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Hapus
                                </button>

                            </td>
                        </tr>
                        <tr v-if="weeklyData.length === 0">
                            <td colspan="3" class="text-gray-400 py-4">Belum ada data panen mingguan untuk bulan ini.
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="text-right mt-4">
                    <button @click="exportToExcel"
                        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
                        <svg class="inline-block w-5 h-5 mr-2 -mt-1" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
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
import Swal from "sweetalert2"; // <--- Tambahkan ini

export default {
    name: "TambahPanen",
    components: { Navbar, Footer },
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
            weeksInMonthDetailed: [],
            formData: {
                week: "",
                ton: ""
            },
            editingIndex: null
        };
    },

    methods: {
        populateYears() {
            const now = new Date().getFullYear();
            for (let y = 2024; y <= now; y++) this.availableYears.push(y);
        },

        generateWeeklyRanges(year, month) {
            const lastDate = new Date(year, month + 1, 0).getDate();
            const ranges = [];
            let start = 1;
            while (start <= lastDate) {
                const end = Math.min(start + 6, lastDate);
                ranges.push({ week: ranges.length + 1, start, end });
                start = end + 1;
            }
            return ranges;
        },

        getWeekLabel(weekNumber) {
            const week = this.weeksInMonthDetailed.find(w => w.week === weekNumber);
            if (!week) return `Minggu ke-${weekNumber}`;
            return `Minggu ke-${week.week} (${week.start}–${week.end} ${this.monthNames[this.selectedMonth]})`;
        },

        async fetchWeeklyData() {
            try {
                this.weeksInMonthDetailed = this.generateWeeklyRanges(this.selectedYear, this.selectedMonth);
                const res = await api.GetAllPanen({
                    year: this.selectedYear,
                    month: this.selectedMonth
                });
                this.weeklyData = res.data;
            } catch (err) {
                console.error("Gagal mengambil data:", err);
                Swal.fire("Gagal!", "Tidak dapat mengambil data dari server.", "error");
            }
        },

        async handleSubmit() {
            const { week, ton } = this.formData;
            if (!week || !ton) {
                return Swal.fire("Oops!", "Harap lengkapi semua kolom!", "warning");
            }

            const weekNumber = Number(week);
            const tonVal = Number(ton);
            const weekRange = this.weeksInMonthDetailed.find(w => w.week === weekNumber);

            const payload = {
                year: this.selectedYear,
                month: this.selectedMonth,
                week: weekNumber,
                ton: tonVal,
                startDate: `${this.selectedYear}-${this.selectedMonth + 1}-${weekRange.start}`,
                endDate: `${this.selectedYear}-${this.selectedMonth + 1}-${weekRange.end}`
            };

            try {
                if (this.editingIndex !== null) {
                    const id = this.weeklyData[this.editingIndex]._id;
                    await api.UpdatePanen(id, payload);
                    Swal.fire("Berhasil!", "Data panen berhasil diperbarui.", "success");
                    this.editingIndex = null;
                } else {
                    const alreadyExist = this.weeklyData.find(w => w.week === weekNumber);
                    if (alreadyExist) {
                        return Swal.fire("Duplikat!", "Data minggu ini sudah ada!", "error");
                    }

                    await api.CreatePanen(payload);
                    Swal.fire("Berhasil!", "Data panen berhasil ditambahkan.", "success");
                }

                this.formData = { week: "", ton: "" };
                await this.fetchWeeklyData();
            } catch (err) {
                console.error("Gagal simpan data:", err);
                Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
            }
        },

        editEntry(index) {
            const item = this.weeklyData[index];
            this.formData = { week: item.week, ton: item.ton };
            this.editingIndex = index;
            Swal.fire("Edit Mode", "Silakan ubah data lalu klik Simpan.", "info");
        },

        async deleteEntry(index) {
            const id = this.weeklyData[index]._id;

            const confirm = await Swal.fire({
                title: "Yakin ingin hapus?",
                text: "Data yang dihapus tidak dapat dikembalikan.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Batal"
            });

            if (!confirm.isConfirmed) return;

            try {
                await api.DeletePanen(id);
                await this.fetchWeeklyData();
                Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
            } catch (err) {
                console.error("Gagal hapus data:", err);
                Swal.fire("Gagal!", "Tidak dapat menghapus data.", "error");
            }
        },

        exportToExcel() {
            const wsData = [["Minggu", "Rentang Tanggal", "Jumlah Panen (Ton)"]];
            this.weeklyData.forEach(entry => {
                const week = this.weeksInMonthDetailed.find(w => w.week === entry.week);
                const range = week
                    ? `${week.start}–${week.end} ${this.monthNames[this.selectedMonth]}`
                    : "-";
                wsData.push([`Minggu ke-${entry.week}`, range, entry.ton]);
            });

            const worksheet = XLSX.utils.aoa_to_sheet(wsData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Panen Mingguan");

            const filename = `panen-${this.selectedMonth + 1}-${this.selectedYear}.xlsx`;
            XLSX.writeFile(workbook, filename);
            Swal.fire("Berhasil!", "Data berhasil diekspor ke Excel.", "success");
        }
    },

    mounted() {
        document.title = "Panen Mingguan (Ton)";
        this.populateYears();
        this.fetchWeeklyData();
    },

    watch: {
        selectedMonth() {
            this.fetchWeeklyData();
        },
        selectedYear() {
            this.fetchWeeklyData();
        }
    }
};
</script>
<style scoped>
.font-inter {
    font-family: 'Inter', sans-serif;
}
</style>