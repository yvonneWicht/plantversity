<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

interface Plant {
  id: string
  name: string
}

interface MealListItem {
  id: string
  name: string
  plants: Plant[]
}

const isPrimary = ref(true)
const search = ref('')
const mealName = ref('')
const nameTaken = ref(false)
const selectedPlants = ref<Plant[]>([])
const isSaving = ref(false)
const saveError = ref('')

const {data: meals, refresh: refreshMeals} = await useFetch<MealListItem[]>('/api/meals')

const DEBOUNCE_MS = 250
let nameCheckTimer: ReturnType<typeof setTimeout> | null = null

watch(mealName, (value) => {
  if (nameCheckTimer) {
    clearTimeout(nameCheckTimer)
    nameCheckTimer = null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    nameTaken.value = false
    return
  }

  nameCheckTimer = setTimeout(async () => {
    try {
      const response = await $fetch('/api/check-meal-name', {
        method: 'POST',
        body: {name: trimmed}
      })
      nameTaken.value = response.exists
    } catch (error) {
      console.error('Fehler bei der Namensprüfung:', error)
    }
  }, DEBOUNCE_MS)
})

const canSave = computed(() =>
  mealName.value.trim().length > 0 &&
  !nameTaken.value &&
  selectedPlants.value.length >= 2 &&
  !isSaving.value
)

function addPlant(plant: Plant) {
  selectedPlants.value.push(plant)
}

function removePlant(plantId: string) {
  selectedPlants.value = selectedPlants.value.filter((plant) => plant.id !== plantId)
}

async function saveMeal() {
  if (!canSave.value) return

  isSaving.value = true
  saveError.value = ''

  try {
    const meal = await $fetch('/api/meals', {
      method: 'POST',
      body: {name: mealName.value.trim()}
    })

    await $fetch('/api/meal-plants', {
      method: 'POST',
      body: {
        meal_id: meal.id,
        plant_ids: selectedPlants.value.map((plant) => plant.id)
      }
    })

    mealName.value = ''
    selectedPlants.value = []
    nameTaken.value = false
    await refreshMeals()
    isPrimary.value = false
  } catch (error: unknown) {
    console.error('Fehler beim Speichern der Mahlzeit:', error)
    const err = error as { statusCode?: number; statusMessage?: string; data?: { statusMessage?: string } }
    if (err?.statusCode === 409) {
      nameTaken.value = true
    } else {
      const detail = err?.data?.statusMessage || err?.statusMessage
      saveError.value = detail
        ? `Mahlzeit konnte nicht gespeichert werden: ${detail}`
        : 'Mahlzeit konnte nicht gespeichert werden. Bitte versuche es erneut.'
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-3 h-full grow min-h-0">
    <ElementToggle v-model="isPrimary" primary-button-text="Deine Mahlzeiten" secondary-button-text="Mahlzeit erstellen"
                   class="grow min-h-0">
      <template #primary>
        <div v-if="meals && meals.length > 0" class="flex flex-col gap-3 h-full min-h-0">
          <ElementMeal v-for="meal in meals" :key="meal.id" :name="meal.name"/>
        </div>
        <div v-else class="flex flex-col gap-3 h-full min-h-0">
          <div class="flex flex-col gap-3 items-center justify-center grow">
            <div class="text-lg">Hier ist noch nichts passiert!</div>
              <img src="~/assets/images/leafs.svg" width="100" height="100" alt="Leafs">
            <div class="text-sm text-center">Erstelle und verwalte deine Lieblingsmahlzeiten um diese mit nur einem Klick zu tracken!</div>
          </div>
        </div>
      </template>
      <template #secondary>
        <div class="flex flex-col gap-3 h-full min-h-0">
          <div class="flex-none">
            <FormInput v-model="mealName" type="text" name="meal-name" placeholder="Name der Mahlzeit" class="w-full"/>
            <div v-if="nameTaken" role="alert" aria-live="polite" class="text-sm text-red-600 pt-1">
              Dieser Name ist bereits vergeben.
            </div>
          </div>

          <FormSearch
            id="plant-search"
            v-model="search"
            type="text"
            name="plant-search"
            placeholder="Pflanze suchen"
            class="flex-none z-50"
            :existing-plant-ids="selectedPlants.map((plant) => plant.id)"
            :auto-submit="false"
            @add="addPlant"
          />

          <div class="grow flex flex-col gap-2 min-h-0 overflow-y-scroll">
            <ElementMealPlant
              v-for="plant in selectedPlants"
              :key="plant.id"
              :name="plant.name"
              @remove="removePlant(plant.id)"
            />
          </div>

          <div v-if="saveError" role="alert" aria-live="polite" class="text-sm text-red-600 flex-none">
            {{ saveError }}
          </div>

          <ButtonPrimary class="w-full flex-none" :disabled="!canSave" @click="saveMeal">
            Mahlzeit speichern
          </ButtonPrimary>
        </div>
      </template>

    </ElementToggle>
  </div>
</template>
