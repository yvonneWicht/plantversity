<script setup lang="ts">
  definePageMeta({
    middleware: 'auth'
  })

  const search = ref('')

  // useFetch statt $fetch: leitet die Session-Cookies beim SSR an die API weiter
  const { data: dailyPlants } = await useFetch('/api/daily-plants', {
    query: { range: 'today' }
  })

  const { data: weeklyPlants } = await useFetch('/api/daily-plants', {
    query: { range: '7days' }
  })

  const uniqueWeeklyPlants = computed(() => {
    if (!weeklyPlants.value) return []

    return Array.from(
      new Map(
        weeklyPlants.value.map((entry) => [entry.plant?.id, entry])
      ).values()
    )
  })
</script>

<template>
  <div class="flex flex-col gap-3 h-full grow min-h-0">
    <IconPlantJar class="flex-none min-h-2/5 max-h-2/4 justify-self-center px-16"/>

    <ElementProgressBar class="flex-none" :amountWeeklyPlants="uniqueWeeklyPlants.length"/>

    <ElementToggle primaryButtonText="Pflanzen" secondaryButtonText="Mahlzeiten" class="flex-none">
      <template #primary>
        <FormSearch v-model="search" :dailyPlants="dailyPlants" type="text" id="plant-search" name="plant-search" placeholder="Pflanze suchen"/>
      </template>
      <template #secondary>
        <FormSearch v-model="search" ype="text" id="plant-search" name="plant-search" placeholder="Mahlzeit suchen"/>
      </template>
    </ElementToggle>

    <ElementBox headline="Heute gegessen" class="grow flex flex-col min-h-0">
      <div v-if="dailyPlants.length > 0" class="flex flex-row flex-wrap overflow-y-scroll h-full min-h-0">
        <div v-for="plant in dailyPlants" :key="plant.id" class="w-1/3 px-1 text-center">
              {{ plant.plant.name }}
          </div>
      </div>
      <div v-else class="text-center">
        Hier ist noch nichts gegessen.<br>
        Tracke jetzt deinen ersten Plant Point!
      </div>
    </ElementBox>
  </div>

</template>