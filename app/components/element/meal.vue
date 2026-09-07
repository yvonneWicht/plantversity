<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<template>
  <div class="relative z-10 bg-white p-2 rounded-full inline-block w-full px-5">
    {{ name }}

    <ButtonPrimary
      type="button"
      class="absolute right-0 top-1/2 -translate-y-1/2 h-full aspect-square"
      @click=""
    >
      >
    </ButtonPrimary>
  </div>
</template>
