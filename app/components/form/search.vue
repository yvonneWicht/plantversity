<script setup lang="ts">
interface PlantSearchResult {
  id: string
  name: string
  [key: string]: unknown
}

interface MealSearchResult {
  id: string
  name: string
  plants: { id: string; name: string }[]
}

interface DailyPlantEntry {
  id?: string
  plant?: string | PlantSearchResult | { id?: string; name?: string; [key: string]: unknown } | null
  [key: string]: unknown
}

const props = withDefaults(defineProps<{
  type?: string
  id?: string
  name?: string
  placeholder?: string
  dailyPlants?: DailyPlantEntry[]
  existingPlantIds?: string[]
  autoSubmit?: boolean
  searchType?: 'plant' | 'meal'
}>(), {
  autoSubmit: true,
  searchType: 'plant'
})

const emit = defineEmits<{
  add: [plant: { id: string; name: string }]
}>()

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const search = defineModel<string>()
const results = ref<(PlantSearchResult | MealSearchResult)[]>([])
const selectedPlantId = ref<string | null>(null)
const selectedMeal = ref<MealSearchResult | null>(null)
const isSubmitting = ref(false)
const isSelected = ref(false)
const searchWrapper = ref<HTMLElement | null>(null)

const DEBOUNCE_MS = 250
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function getLocalDateString(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function fetchResults(value: string) {
  try {
    const response = props.searchType === 'meal'
      ? await $fetch('/api/meals', { query: { search: value } })
      : await $fetch('/api/plants', { query: { search: value } })
    results.value = response
  } catch (error) {
    console.error('Fehler beim Laden der Suchergebnisse:', error)
  }
}

watch(search, (value) => {
  if (isSelected.value) {
    isSelected.value = false
    return
  }

  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }

  if (!value || value.length < 3) {
    results.value = []
    selectedPlantId.value = null
    selectedMeal.value = null
    return
  }

  selectedPlantId.value = null
  selectedMeal.value = null

  debounceTimer = setTimeout(() => {
    fetchResults(value)
  }, DEBOUNCE_MS)
})

function handleClickOutside(event: MouseEvent) {
  if (searchWrapper.value && !searchWrapper.value.contains(event.target as Node)) {
    results.value = []
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer) clearTimeout(debounceTimer)
})

function selectPlant(result: PlantSearchResult | MealSearchResult) {
  if (search.value !== result.name) {
    isSelected.value = true
    search.value = result.name
  }
  selectedPlantId.value = result.id
  selectedMeal.value = props.searchType === 'meal' ? (result as MealSearchResult) : null
  results.value = []
}

function isPlantTracked(plantId: string): boolean {
  return Boolean(
    props.dailyPlants?.some((entry) => entry.plant?.id === plantId || entry.plant === plantId) ||
    props.existingPlantIds?.includes(plantId)
  )
}

async function trackPlant(plantId: string, userId: string | undefined) {
  await $fetch('/api/daily-plants', {
    method: 'POST',
    body: {
      plant: plantId,
      created_by: userId,
      created_at: getLocalDateString()
    }
  })
}

async function addMeal(meal: MealSearchResult) {
  const newPlantIds = meal.plants
    .map((plant) => plant.id)
    .filter((plantId) => !isPlantTracked(plantId))

  if (newPlantIds.length === 0) {
    console.warn('Alle Pflanzen dieser Mahlzeit wurden heute bereits eingetragen.')
    search.value = ''
    selectedPlantId.value = null
    selectedMeal.value = null
    return
  }

  let userId = user.value?.id
  if (!userId) {
    const { data: sessionData } = await supabase.auth.getSession()
    userId = sessionData.session?.user?.id
  }

  isSubmitting.value = true

  try {
    await Promise.all(newPlantIds.map((plantId) => trackPlant(plantId, userId)))

    search.value = ''
    selectedPlantId.value = null
    selectedMeal.value = null
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Mahlzeit:', error)
  } finally {
    isSubmitting.value = false
    await refreshNuxtData()
  }
}

async function addPlant(plantId: string | null) {
  if (!plantId) return

  if (props.searchType === 'meal') {
    if (selectedMeal.value) await addMeal(selectedMeal.value)
    return
  }

  if (isPlantTracked(plantId)) {
    console.warn('Diese Pflanze wurde bereits hinzugefügt.')
    search.value = ''
    selectedPlantId.value = null
    return
  }

  if (!props.autoSubmit) {
    emit('add', { id: plantId, name: search.value })
    search.value = ''
    selectedPlantId.value = null
    return
  }

  let userId = user.value?.id
  if (!userId) {
    const { data: sessionData } = await supabase.auth.getSession()
    userId = sessionData.session?.user?.id
  }

  isSubmitting.value = true

  try {
    await trackPlant(plantId, userId)

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
  <div ref="searchWrapper" class="relative">
    <form class="relative z-10" @submit.prevent="addPlant(selectedPlantId)">
      <FormInput
        :id="id"
        v-model="search"
        :type="type"
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
          <button type="button" class="text-left w-full" @click="selectPlant(result)">
            {{ result.name }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>