<template>
  <input
    class="text-2xl bg-white p-4 pl-6 border rounded-full"
    :type
    :id
    :name
    :placeholder
    :required
  />
</template>

<script setup lang="ts">
defineProps({
  type: String,
  id: String,
  name: String,
  placeholder: String
})
</script>