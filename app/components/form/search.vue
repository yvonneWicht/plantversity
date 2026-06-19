<script setup lang="ts">
defineProps({
  type: String,
  id: String,
  name: String,
  placeholder: String
})
</script>

<template>
  <form class="relative">
    <FormInput
      :type=type
      :id=id
      :name=name
      :placeholder=placeholder
      class="w-full pr-16"
    />

    <ButtonPrimary
      class="absolute right-0 top-1/2 -translate-y-1/2 w-16"
      @click=""
    >
      +
    </ButtonPrimary>
  </form>
</template>