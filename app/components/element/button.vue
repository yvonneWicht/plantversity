<template>
  <NuxtLink :to="targetLink">
    <button class="bg-green-700 flex flex-col m-3 p-2" :type>
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