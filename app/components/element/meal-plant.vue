<script setup lang="ts">
defineProps<{
  name: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  remove: []
}>()
</script>

<template>
  <div class="relative z-10 bg-beige p-2 rounded-full inline-block w-full px-5">
    {{ name }}

    <ButtonDelete
      type="button"
      class="absolute right-0 top-1/2 -translate-y-1/2 h-full aspect-square"
      :disabled="disabled"
      @click="emit('remove')"
    >
      X
    </ButtonDelete>
  </div>
</template>
