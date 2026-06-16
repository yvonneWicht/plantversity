<template>
  <NuxtLink :to="targetLink" class="flex flex-col">
    <button
      class="text-2xl p-4 rounded-full"
      :class="state ? 'bg-beige' : 'bg-transparent'"
      :type
      :data-testid
    >
      {{ buttonText }}
    </button>

  </NuxtLink>
</template>

<script setup lang="ts">
defineProps({
  targetLink: String,
  buttonText: String,
  type: String,
  state: Boolean,
  "data-testid": String
})
</script>