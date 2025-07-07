<template>
    <div
        class="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 font-inter text-white px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
        <!-- SVG Background Pattern -->
        <svg class="absolute inset-0 w-full h-full z-0 opacity-10" aria-hidden="true">
            <defs>
                <pattern id="grid-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(0, 255, 0, 0.1)" stroke-width="0.5" />
                </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>

        <div
            class="relative z-10 w-full max-w-md p-6 sm:p-8 bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-glow">
            <h1 class="text-3xl sm:text-4xl font-extrabold text-center text-green-400 mb-6 sm:mb-8 tracking-wide">
                Register for Monitoring</h1>
            <p class="text-center text-gray-300 text-sm sm:text-base mb-6 sm:mb-8">Create your account to access energy
                insights.</p>
            <form @submit.prevent="register">
                <div class="mt-4 sm:mt-6">
                    <label for="username" class="block text-sm font-semibold text-gray-200 mb-2">Username</label>
                    <input type="text" v-model="username" id="username" placeholder="Choose a username" required
                        class="mt-1 block w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition duration-200" />
                </div>
                <div class="mt-4 sm:mt-6">
                    <label for="email" class="block text-sm font-semibold text-gray-200 mb-2">Email Address</label>
                    <input type="email" v-model="email" id="email" placeholder="your.email@example.com" required
                        class="mt-1 block w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition duration-200" />
                </div>
                <div class="mt-4 sm:mt-6">
                    <label for="password" class="block text-sm font-semibold text-gray-200 mb-2">Password</label>
                    <input type="password" v-model="password" id="password" placeholder="••••••••" required
                        class="mt-1 block w-full p-2 sm:p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-500 focus:border-green-500 transition duration-200" />
                </div>
                <div class="mt-6 sm:mt-8">
                    <button type="submit"
                        class="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-gray-900 font-bold rounded-lg shadow-lg hover:from-orange-600 hover:to-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-400 transition duration-300 transform hover:-translate-y-1">
                        <svg class="inline-block w-5 h-5 mr-2 -mt-1" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM12 14v3m-4 0h8a2 2 0 002-2v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2a2 2 0 002 2z">
                            </path>
                        </svg>
                        Register Account
                    </button>
                </div>
            </form>
            <div class="mt-6 text-center">
                <p class="text-gray-400 text-xs sm:text-sm">Already have an account?</p>
                <button @click="login"
                    class="mt-3 sm:mt-4 py-2 px-4 bg-gradient-to-r from-blue-600 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 transition duration-300 transform hover:-translate-y-1">
                    <svg class="inline-block w-4 h-4 mr-1 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1">
                        </path>
                    </svg>
                    Back to Sign In
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from "@/services/api";
import Swal from "sweetalert2";

export default {
    name: "RegisterView",
    data() {
        return {
            username: "",
            email: "",
            password: ""
        };
    },
    mounted() {
        this.scrollToTop();
    },
    methods: {
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
        async register() {
            Swal.fire({
                title: "Mendaftarkan akun...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            try {

                await Api.Register({
                    username: this.username,
                    email: this.email,
                    password: this.password
                });

                Swal.close();
                await Swal.fire({
                    icon: "success",
                    title: "Registrasi berhasil!",
                    position: "center",
                    toast: true,
                    timer: 1500,
                    showConfirmButton: false,
                });

                this.$router.push("/login");

            } catch (err) {
                console.error(err);
                Swal.close();

                await Swal.fire({
                    icon: "error",
                    title: "Registrasi gagal!",
                    text: err?.response?.data?.message || err.message || "Terjadi kesalahan.",
                    position: "center",
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        },
        async login() {
            try {
                await this.$router.push("/login");
            } catch (error) {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal kembali!",
                    text: error.message || "Terjadi kesalahan.",
                    position: "center",
                    toast: true,
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        }
    }
};
</script>

<style scoped>
.font-inter {
    font-family: 'Inter', sans-serif;
}

.hover\:shadow-glow:hover {
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5), 0 0 30px rgba(0, 255, 0, 0.3), 0 0 45px rgba(0, 255, 0, 0.1);
}
</style>