<script setup lang="ts">
defineProps({
  targetLink: String,
  type: String,
  state: Boolean,
  "data-testid": String
})
</script>

<template>
  <NuxtLink :to="targetLink" class="flex flex-col">
    <button
      class="p-1 rounded-full text-sm"
      :class="state ? 'bg-beige' : 'bg-transparent'"
      :type
      :data-testid
    >
      <slot/>
    </button>

  </NuxtLink>
</template>