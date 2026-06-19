<script setup lang="ts">
defineProps({
  targetLink: String,
  class: String,
  type: String
})
</script>

<template>
  <NuxtLink :to="targetLink" class="flex flex-col">
    <button class="bg-primary-green text-white p-1 rounded-full" :class="class" :type>
      <slot/>
    </button>
  </NuxtLink>
</template>