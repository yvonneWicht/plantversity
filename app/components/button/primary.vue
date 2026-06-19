<script setup lang="ts">
defineProps({
  targetLink: String,
  type: String
})
</script>

<template>
  <NuxtLink :to="targetLink" class="flex flex-col">
    <button class="bg-primary-green text-2xl text-white p-4 rounded-full" :type>
      <slot/>
    </button>
  </NuxtLink>
</template>