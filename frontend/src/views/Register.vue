<template>
    <div class="flex items-center justify-center h-[30rem]">
        <div class="bg-neutral-200 p-8 rounded shadow-md w-full max-w-md">
            <h1 class="text-2xl font-semibold mb-6 text-center">Register</h1>
            <form @submit.prevent="register">
                <div class="form-part mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                    <input type="text" v-model="username" id="username" placeholder="Username" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
                <div class="form-part mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" v-model="email" id="email" placeholder="Email" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
                <div class="form-part mb-6">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" v-model="password" id="password" placeholder="Password" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                </div>
                <button
                    class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Register
                </button>
            </form>
            <div class="mt-6">
                <button @click="login"
                    class="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 focus:outline-none">
                    Login
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Api from "@/services/api";

export default {
    name: "RegisterView",
    data() {
        return {
            username: "",
            email: "",
            password: ""
        }
    },
    mounted() {
        this.scrollToTop()
    },
    methods: {
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        },
        register() {
            Api.post("/users/register", {
                username: this.username,
                email: this.email,
                password: this.password
            })
                .then(() => {
                    this.$toast.success("Registration succeeded!", { position: "bottom-left", duration: 1000 });
                    this.$router.push("/login");
                })
                .catch((err) => {
                    console.log(err);
                    this.$toast.error("Registration failed!", { position: "bottom-left", duration: 1000 });
                })
        },
        async login() {
            try {
                await this.$router.push("/login");
            } catch (error) {
                //  console.log(err);
                this.$toast.error(`Gagal Kemabli! ${error.message}`, { position: "bottom-left", duration: 1000 });
            }
        },
    }
}
</script>