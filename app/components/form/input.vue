<script setup lang="ts">
withDefaults(defineProps<{
  type?: string
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
}>(), {
  type: 'text',
  id: '',
  name: '',
  placeholder: '',
  required: false
})

const model = defineModel<string>()
</script>

<template>
  <input
    :id
    v-model="model"
    class="bg-white p-2 pl-4 border rounded-full border-1 border-primary-green"
    :type
    :name
    :placeholder
    :required
  >
</template>