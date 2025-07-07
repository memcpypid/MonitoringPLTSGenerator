<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-red-600">404</h1>
        <p class="mt-4 text-lg text-gray-600">Oops! The page you’re looking for does not exist.</p>
        <router-link 
          to="/" 
          class="mt-6 inline-block px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">
          Go Back Home
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotFound",
  };
  </script>
  