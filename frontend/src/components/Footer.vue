<template>
  <footer
    class="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg text-gray-400 text-center py-6 w-full shadow-lg rounded-t-xl mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p class="text-sm sm:text-base font-medium">&copy; {{ currentYear }} PLTS & Generator Monitoring. All rights
        reserved.</p>
      <!-- <p class="text-xs sm:text-sm mt-2">
        <a href="#" class="hover:text-green-400 transition-colors duration-200">Privacy Policy</a> |
        <a href="#" class="hover:text-green-400 transition-colors duration-200">Terms of Service</a>
      </p> -->
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterPage',
  data() { return { currentYear: new Date().getFullYear() } }

};
</script>

<style scoped>
/* Custom styling can be added here if needed */
</style>
