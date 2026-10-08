<!--This component shows the eaten plants and the distribution of plant categories for a given time range-->

<script setup lang="ts">
const props = defineProps<{
  range: '7days' | 'all'
}>()

const { data: statistics } = useFetch('/api/statistics', {
  query: { range: props.range }
})
</script>

<template>
  <div class="flex flex-col gap-3 grow min-h-0">
    <ElementBox headline="Gegessene Pflanzen" class="grow min-h-0">
      <div v-if="statistics && statistics.plants.length > 0" class="flex flex-row flex-wrap gap-2 content-start justify-center overflow-y-auto h-full min-h-0">
        <div v-for="plant in statistics.plants" :key="plant.id" class="px-1 text-center">
          {{ plant.name }}
        </div>
      </div>
      <div v-else class="text-center">
        Noch keine Pflanzen getrackt.
      </div>
    </ElementBox>

    <ElementBox headline="Pflanzenkategorien" class="flex-none">
      <div v-if="statistics && statistics.categories.length > 0" class="flex flex-col gap-1.5">
        <ElementCategoryBar
          v-for="category in statistics.categories"
          :key="category.slug"
          :name="category.name"
          :percent="category.percent"
          :color="CATEGORY_COLORS[category.slug] ?? FALLBACK_COLOR"
        />
      </div>
      <div v-else class="text-center">
        Noch keine Pflanzen getrackt.
      </div>
    </ElementBox>
  </div>
</template>
