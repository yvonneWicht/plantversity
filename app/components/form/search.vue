<script setup lang="ts">
const props = defineProps<{
  type?: string
  id?: string
  name?: string
  placeholder?: string
  dailyPlants?: any[]
}>()

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const search = defineModel<string>()
const results = ref<any[]>([])
const selectedPlantId = ref<string | null>(null)
const isSubmitting = ref(false)
const isSelected = ref(false)

function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

watch(search, async (value) => {
  if (isSelected.value) {
    isSelected.value = false
    return
  }

  if (!value || value.length < 3) {
    results.value = []
    selectedPlantId.value = null
    return
  }

  selectedPlantId.value = null

  try {
    const response = await $fetch(`/api/plants`, {
      query: {
        search: value
      }
    })
    results.value = response
  } catch (error) {
    console.error('Fehler beim Laden der Pflanzen:', error)
  }
})

function selectPlant(plant: { name: string; id: string }) {
  if (search.value !== plant.name) {
    isSelected.value = true
    search.value = plant.name
  }
  selectedPlantId.value = plant.id
  results.value = []
}

async function addPlant(plantId: string | null) {
  if (!plantId) return

  // 1. Check if the plant was already added today
  const isAlreadyAdded = props.dailyPlants?.some(
    (entry) => entry.plant?.id === plantId || entry.plant === plantId
  )

  if (isAlreadyAdded) {
    console.warn('Diese Pflanze wurde heute bereits eingetragen.')
    // Reset inputs and exit early without making an API request
    search.value = ''
    selectedPlantId.value = null
    return
  }

  // 2. Retrieve the user ID (using a fallback directly via the session if `useSupabaseUser` has not yet responded)
  let userId = user.value?.id
  if (!userId) {
    const { data: sessionData } = await supabase.auth.getSession()
    userId = sessionData.session?.user?.id
  }

  isSubmitting.value = true

  try {
    console.log(new Date().getDate())
    const response = await $fetch('/api/daily-plants', {
      method: 'POST',
      body: {
        plant: plantId,
        created_by: userId,
        created_at: getLocalDateString()
      }
    })

    console.log('Pflanze erfolgreich hinzugefügt:', response)
    // Reset form after successful submission
    search.value = ''
    selectedPlantId.value = null
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Pflanze:', error)
  } finally {
    isSubmitting.value = false
    await refreshNuxtData()
  }
}
</script>

<template>
  <form class="relative z-10" @submit.prevent="addPlant(selectedPlantId)">
    <FormInput
      v-model="search"
      :type="type"
      :id="id"
      :name="name"
      :placeholder="placeholder"
      class="w-full pr-16"
    />

    <ButtonPrimary
      type="button"
      class="absolute right-0 top-1/2 -translate-y-1/2 h-full aspect-square"
      :disabled="!selectedPlantId || isSubmitting"
      @click="addPlant(selectedPlantId)"
    >
      +
    </ButtonPrimary>
  </form>

  <div v-if="results.length > 0" class="relative">
    <ul class="absolute top-full left-0 right-0 rounded-3xl bg-white -mt-8 pt-8 z-0">
      <li v-for="result in results" :key="result.id" class="px-4 py-1">
        <button type="button" @click="selectPlant(result)">
          {{ result.name }}
        </button>
      </li>
    </ul>
  </div>
</template>