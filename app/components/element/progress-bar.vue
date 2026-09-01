<!--This bar shows the progress of the user's plant points.-->

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    amountWeeklyPlants?: number | string
    maxPoints?: number
  }>(),
  {
    amountWeeklyPlants: 0,
    maxPoints: 30
  }
)

const progressPercentage = computed(() => {
  const current = Number(props.amountWeeklyPlants) || 0
  const percentage = (current / props.maxPoints) * 100
  return Math.min(100, Math.max(0, percentage))
})

</script>

<template>
  <div class="relative w-full bg-white rounded-full p-2 text-center border-1 border-primary-green">
    {{ amountWeeklyPlants }}/30 Plant Points
    <div
      class="absolute inset-y-0 left-0 rounded-full bg-primary-green/40"
      :style="{ width: `${progressPercentage}%` }"
    />
  </div>
</template>