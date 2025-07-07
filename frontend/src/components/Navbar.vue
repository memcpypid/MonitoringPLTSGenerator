<template>
  <nav class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg p-4 shadow-lg font-inter text-white">
    <div class="container mx-auto flex flex-wrap items-center justify-between">
      <!-- Logo & Clock -->
      <div class="flex items-center justify-between w-full sm:w-auto">
        <router-link to="/" class="text-green-400 text-2xl font-bold hover:scale-105 transition-transform duration-300">
          Smart Data Logger
        </router-link>

        <div class="sm:hidden ml-auto">
          <button @click="isMenuOpen = !isMenuOpen" class="focus:outline-none">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
              stroke-linecap="round" stroke-linejoin="round">
              <path v-if="!isMenuOpen" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Clock (sm and above) -->
      <div class="hidden sm:flex items-center space-x-2 text-sm sm:text-base text-gray-300 ml-4">
        <div v-if="userRole" class="flex items-center space-x-2 text-white">
          <!-- SVG Ikon User -->
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
          </svg>
          <span class="font-semibold text-sm sm:text-base">{{ userRole.username }}</span>
        </div>

        <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>

        <span> {{ currentTime }}</span>
        <span class=" hidden sm:inline">|</span>
        <span class="hidden sm:inline">{{ currentDate }}</span>
      </div>

      <!-- Menu Items -->
      <div :class="{ 'block': isMenuOpen, 'hidden': !isMenuOpen }"
        class="w-full sm:flex sm:items-center sm:w-auto mt-4 sm:mt-0 transition-all duration-300">
        <div class="flex sm:hidden items-center justify-center space-x-2 text-sm text-gray-300 mb-4">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ currentTime }}</span>
          <span>|</span>
          <span>{{ currentDate }}</span>
        </div>
        <div v-if="userRole" class="flex sm:hidden items-center justify-center space-x-2 text-sm text-gray-300 mb-4">
          <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 10-6 0 3 3 0 006 0z" />
          </svg>
          <span>{{ userRole.username }}</span>
        </div>
        <ul class="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
          <li><router-link to="/" class="nav-link" active-class="bg-gray-700 text-green-400">Home</router-link></li>
          <li><router-link to="/history" class="nav-link"
              active-class="bg-gray-700 text-green-400">History</router-link></li>
          <li><router-link to="/hasil-panen" class="nav-link" active-class="bg-gray-700 text-green-400">Hasil
              Panen</router-link></li>
          <li v-if="userRole && userRole.role === 'admin'">
            <router-link to="/tambah-hasil-panen" class="nav-link" active-class="bg-gray-700 text-green-400">
              Tambah Hasil Panen
            </router-link>
          </li>
          <li>
            <button @click="logout" class="logout-btn">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 12H4m12 0l-4-4m4 4l-4 4m8-10a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6z" />
              </svg>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import Swal from "sweetalert2";

export default {
  name: 'AppNavbar',
  data() {
    return {
      currentTime: '',
      currentDate: '',
      intervalId: null,
      isMenuOpen: false,
    };
  },
  computed: {
    userRole() {
      return this.$store.state.user;
    }
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('id', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      });
      this.currentDate = now.toLocaleDateString('id', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    },
    async logout() {
      try {
        await this.$store.dispatch("logout");
        await Swal.fire({
          icon: "success",
          title: "Berhasil logout",
          position: "center",
          toast: true,
          timer: 1000,
          showConfirmButton: false,
        });
        await this.$router.push("/login");
      } catch (e) {
        console.error(e);
        await Swal.fire({
          icon: "error",
          title: "Gagal logout",
          text: e.message || "Terjadi kesalahan saat logout.",
          position: "center",
          toast: true,
          timer: 2000,
          showConfirmButton: false,
        });
      }
    },
  },
  mounted() {
    this.updateTime();
    this.intervalId = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  }
};
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}

.nav-link {
  display: block;
  text-align: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: #D1D5DB;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #374151;
  color: #ffffff;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-weight: 600;
  background-color: #dc2626;
  color: white;
  border-radius: 0.5rem;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #b91c1c;
}
</style>
