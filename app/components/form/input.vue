<script setup lang="ts">
defineProps({
  type: String,
  id: String,
  name: String,
  placeholder: String,
  required: Boolean
})
</script>

<template>
  <input
    class="bg-white p-2 pl-4 border rounded-full text-sm border-1 border-primary-green"
    :type
    :id
    :name
    :placeholder
    :required
  />
</template>