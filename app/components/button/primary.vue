<script setup lang="ts">
defineProps<{
  targetLink?: string
  class?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <NuxtLink
    v-if="targetLink"
    :to="targetLink"
    role="button"
    class="bg-primary-green text-white p-2 rounded-full inline-block text-center"
    :class="[
      $props.class,
      disabled ? 'bg-gray-300 opacity-50 cursor-not-allowed pointer-events-none' : ''
    ]"
    :aria-disabled="disabled"
  >
    <slot />
  </NuxtLink>

  <button
    v-else
    class="bg-primary-green text-white p-2 rounded-full disabled:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="$props.class"
    :type="type || 'button'"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>