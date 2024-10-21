<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center text-blue-600">Login</h1>
      <form @submit.prevent="login">
        <div class="mt-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="email" required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
        </div>
        <div class="mt-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" v-model="password" required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
        </div>
        <div class="mt-6">
          <button type="submit"
            class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none">
            Login
          </button>
        </div>
      </form>
      <div class="mt-6">
        <button @click="register"
          class="w-full py-2 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none">
          Register
        </button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      password: ""
    }
  },
  computed: {
    isUserLoggedIn() {
      return this.$store.state.userLoggedIn;
    },
    userRole() {
      return this.$store.state.userRole;
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch("login", { email: this.email, password: this.password });
        if (this.isUserLoggedIn) {
          this.$toast.success("Login succeeded.", { position: "bottom-left", duration: 1000 });
          await this.$router.push("/");
        }
      } catch (error) {
        //  console.log(err);
        this.$toast.error(`Gagal masuk! ${error.message}`, { position: "bottom-left", duration: 1000 });
      }
    },
    async register() {
      try {
        await this.$router.push("/register");
      } catch (error) {
        //  console.log(err);
        this.$toast.error(`Gagal Kemabli! ${error.message}`, { position: "bottom-left", duration: 1000 });
      }
    }
  }
}
</script>
<style scoped></style>
