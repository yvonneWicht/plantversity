<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const { data: achievedKeys } = await useFetch('/api/achievements')
</script>

<template>
  <ElementBox headline="Deine Erfolge" class="grow min-h-0">
    <div class="grid grid-cols-2 grid-rows-3 gap-2 grow min-h-0">
      <div v-for="achievement in ACHIEVEMENTS" :key="achievement.key" class="flex flex-col items-center text-center min-h-0 gap-1">
        <img
          :src="getBadgeImage(achievement.key, achievedKeys?.includes(achievement.key) ?? false)"
          :alt="achievement.title"
          class="flex-1 min-h-0 max-w-full object-contain"
        >
        <div class="flex-none text-xs">{{ achievement.description }}</div>
      </div>
    </div>
  </ElementBox>
</template>
