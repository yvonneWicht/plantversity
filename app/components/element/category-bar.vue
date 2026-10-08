<!--This bar shows the share of one plant category: colored dot, name and percentage above a bar inside a track-->

<script setup lang="ts">
const props = defineProps<{
  name: string
  percent: number
  color: string
}>()

const formattedPercent = computed(() => `${props.percent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`)
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <div class="flex flex-row items-center gap-2 text-sm leading-tight">
      <span class="flex-none size-2 rounded-full" :style="{ backgroundColor: color }"/>
      <span class="grow">{{ name }}</span>
      <span class="flex-none">{{ formattedPercent }}</span>
    </div>
    <div class="w-full h-2 rounded-full bg-primary-green/10 overflow-hidden">
      <div class="h-full rounded-full" :style="{ width: `${percent}%`, backgroundColor: color }"/>
    </div>
  </div>
</template>
