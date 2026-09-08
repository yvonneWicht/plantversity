<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const search = ref('')
const isPrimary = ref(true)

watch(isPrimary, () => {
  search.value = ''
})

const { data: dailyPlants } = await useFetch('/api/daily-plants', {
  query: { range: 'today' }
})

const { data: plantPoints } = await useFetch('/api/plant-points')
</script>

<template>
  <div class="flex flex-col gap-3 h-full grow min-h-0">
    <IconPlantJar class="flex-none justify-self-center px-8 -mt-9"/>

    <ElementProgressBar class="flex-none" :amount-weekly-plants="plantPoints?.totalPoints ?? 0"/>

    <ElementToggle v-model="isPrimary" primary-button-text="Pflanzen" secondary-button-text="Mahlzeiten" class="flex-none">
      <template #primary>
        <FormSearch id="plant-search" v-model="search" :daily-plants="dailyPlants ?? []" type="text" name="plant-search" placeholder="Pflanze suchen"/>
      </template>
      <template #secondary>
        <FormSearch id="meal-search" v-model="search" :daily-plants="dailyPlants ?? []" search-type="meal" type="text" name="meal-search" placeholder="Mahlzeit suchen"/>
      </template>
    </ElementToggle>

    <ElementBox headline="Heute gegessen" class="grow flex flex-col min-h-0">
      <div v-if="dailyPlants && dailyPlants.length > 0" class="flex flex-row flex-wrap overflow-y-scroll h-full min-h-0">
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