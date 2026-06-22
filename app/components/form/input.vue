<script setup lang="ts">
defineProps({
  type: String,
  id: String,
  name: String,
  placeholder: String,
  required: Boolean
})

const model = defineModel<string>()
</script>

<template>
  <input
    v-model="model"
    class="bg-white p-2 pl-4 border rounded-full border-1 border-primary-green"
    :type
    :id
    :name
    :placeholder
    :required
  />
</template>