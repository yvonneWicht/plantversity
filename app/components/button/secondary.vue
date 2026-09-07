<script setup lang="ts">
defineProps<{
  targetLink?: string
  type?: 'button' | 'submit' | 'reset'
  state?: boolean
  class?: string
  'dataTestId'?: string
}>()
</script>

<template>
  <NuxtLink
    v-if="targetLink"
    :to="targetLink"
    role="button"
    class="p-2 rounded-full inline-block text-center"
    :class="[state ? 'bg-beige' : 'bg-transparent', $props.class]"
    :data-testid="$props['dataTestId']"
  >
    <slot />
  </NuxtLink>

  <button
    v-else
    class="p-2 rounded-full"
    :class="[state ? 'bg-beige' : 'bg-transparent', $props.class]"
    :type="type || 'button'"
    :data-testid="$props['dataTestId']"
  >
    <slot />
  </button>
</template>