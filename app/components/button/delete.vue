<script setup lang="ts">
defineProps<{
  class?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="text-red-600 font-bold p-2 rounded-full disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="$props.class"
    :type="type || 'button'"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
