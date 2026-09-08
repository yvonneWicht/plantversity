<!--This Box component is used to structure the frontend through a white background with an optional headline-->

<script setup lang="ts">
const emit = defineEmits<{
  stay: []
  leave: []
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3">
    <div class="flex flex-col w-full bg-primary-green text-white rounded-3xl p-1 text-center gap-3 p-2">
      <div class="text-lg font-bold">ACHTUNG!</div>
      <div>Deine Änderungen wurden noch nicht gespeichert, wenn du die Seite verlässt gehen deine Änderungen verloren.</div>
      <ButtonPrimary type="button" class="w-full !bg-white !text-primary-green" @click="emit('stay')">Mahlzeit weiter bearbeiten</ButtonPrimary>
      <ButtonPrimary type="button" class="w-full !bg-white !text-primary-green" @click="emit('leave')">Seite verlassen</ButtonPrimary>
    </div>
  </div>
</template>