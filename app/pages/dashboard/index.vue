<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">Dashboard</h1>
      <div class="flex items-center gap-2">
        <span v-if="currentUser">Hallo {{ currentUser.user_metadata?.display_name || currentUser.email }}!</span>
        <ElementButton buttonText="Logout" @click="logout" class="bg-red-500"/>
      </div>
    </div>

    <p>Willkommen bei Plantversity!</p>

    <!-- Hier kommt Ihr Dashboard-Inhalt -->
  </div>
</template>

<script setup lang="ts">
const { currentUser, logout } = useAuth()

// Middleware für Authentifizierung
definePageMeta({
  middleware: 'auth'
})
</script>