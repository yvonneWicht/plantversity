<script setup lang="ts">
defineProps<{
  targetLink?: string
  class?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <NuxtLink v-if="targetLink" :to="targetLink" class="flex flex-col">
    <button
      class="bg-primary-green text-white p-2 rounded-full disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      :class="class"
      :type="type"
      :disabled="disabled"
    >
      <slot/>
    </button>
  </NuxtLink>
  <button
    v-else
    class="bg-primary-green text-white p-2 rounded-full disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="class"
    :type="type"
    :disabled="disabled"
  >
    <slot/>
  </button>
</template>