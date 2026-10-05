<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const isLastSevenDays = ref(true)
</script>

<template>
  <div class="flex flex-col h-full grow min-h-0">
    <ElementToggle v-model="isLastSevenDays" primary-button-text="Letzte 7 Tage" secondary-button-text="Gesamt" class="grow min-h-0">
      <template #primary>
        <ElementStatistics range="7days"/>
      </template>
      <template #secondary>
        <ElementStatistics range="all"/>
      </template>
    </ElementToggle>
  </div>
</template>
