<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold">Dashboard</h1>
      <div class="flex items-center gap-2">
        <span v-if="currentUser">Hallo {{ currentUser.user_metadata?.display_name || currentUser.email }}!</span>
        <ElementButtonPrimary buttonText="Logout" @click="logout"/>
      </div>
    </div>

    <p>Willkommen bei Plantversity!</p>

  </div>
</template>

<script setup lang="ts">
const { currentUser, logout } = useAuth()

definePageMeta({
  middleware: 'auth'
})
</script>