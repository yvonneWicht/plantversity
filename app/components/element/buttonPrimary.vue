<template>
  <NuxtLink :to="targetLink" class="flex flex-col">
    <button class="bg-primary-green text-2xl text-white p-4 rounded-full" :type>
      {{ buttonText }}</button>

  </NuxtLink>
</template>

<script setup lang="ts">
  defineProps({
    targetLink: String,
    buttonText: String,
    type: String
  })
</script>