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

const editingMealId = ref<string | null>(null)
const originalName = ref('')
const originalPlantIds = ref<string[]>([])

const isEditing = computed(() => editingMealId.value !== null)

const { data: meals, refresh: refreshMeals } = await useFetch<MealListItem[]>('/api/meals')

const sortedSelectedPlants = computed(() =>
  [...selectedPlants.value].sort((a, b) => a.name.localeCompare(b.name, 'de'))
)

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
      const response = await $fetch('/api/meals/check-name', {
        method: 'POST',
        body: { name: trimmed, excludeId: editingMealId.value ?? undefined }
      })
      nameTaken.value = response.exists
    } catch (error) {
      console.error('Fehler bei der Namensprüfung:', error)
    }
  }, DEBOUNCE_MS)
})

function resetForm() {
  mealName.value = ''
  selectedPlants.value = []
  nameTaken.value = false
  saveError.value = ''
  editingMealId.value = null
  originalName.value = ''
  originalPlantIds.value = []
}

// Beim Verlassen des Formular-Tabs zurück zur Liste immer einen sauberen Neustart sicherstellen
watch(isPrimary, (value) => {
  if (value) resetForm()
})

function openMealForEdit(meal: MealListItem) {
  editingMealId.value = meal.id
  mealName.value = meal.name
  selectedPlants.value = [...meal.plants]
  originalName.value = meal.name
  originalPlantIds.value = meal.plants.map((plant) => plant.id).sort()
  nameTaken.value = false
  saveError.value = ''
  isPrimary.value = false
}

const isDirty = computed(() => {
  if (!isEditing.value) return true

  if (mealName.value.trim() !== originalName.value) return true

  const currentIds = selectedPlants.value.map((plant) => plant.id).sort()
  if (currentIds.length !== originalPlantIds.value.length) return true
  return currentIds.some((id, index) => id !== originalPlantIds.value[index])
})

// Bestimmt, ob beim Verlassen des Formular-Tabs gewarnt werden muss: beim Bearbeiten sobald sich
// etwas gegenüber dem Original geändert hat, beim Erstellen sobald erste Eingaben gemacht wurden
const hasUnsavedChanges = computed(() => {
  if (!isPrimary.value) {
    if (isEditing.value) return isDirty.value
    return mealName.value.trim().length > 0 || selectedPlants.value.length > 0
  }
  return false
})

const showLeaveWarning = ref(false)
let onConfirmLeave: (() => void) | null = null
let onCancelLeave: (() => void) | null = null

function requestLeave(action: () => void, onCancel?: () => void) {
  if (!hasUnsavedChanges.value) {
    action()
    return
  }
  onConfirmLeave = action
  onCancelLeave = onCancel ?? null
  showLeaveWarning.value = true
}

function confirmLeaveWarning() {
  showLeaveWarning.value = false
  const action = onConfirmLeave
  onConfirmLeave = null
  onCancelLeave = null
  action?.()
}

function cancelLeaveWarning() {
  showLeaveWarning.value = false
  const onCancel = onCancelLeave
  onConfirmLeave = null
  onCancelLeave = null
  onCancel?.()
}

function handleTabChange(next: boolean) {
  if (next && !isPrimary.value) {
    requestLeave(() => {
      isPrimary.value = true
    })
    return
  }
  isPrimary.value = next
}

onBeforeRouteLeave(() => {
  if (!hasUnsavedChanges.value) return true

  return new Promise<boolean>((resolve) => {
    requestLeave(
      () => resolve(true),
      () => resolve(false)
    )
  })
})

const canSave = computed(() =>
  mealName.value.trim().length > 0 &&
  !nameTaken.value &&
  selectedPlants.value.length >= 2 &&
  !isSaving.value &&
  isDirty.value
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
    if (isEditing.value) {
      await $fetch(`/api/meals/${editingMealId.value}`, {
        method: 'PATCH',
        body: {
          name: mealName.value.trim(),
          plant_ids: selectedPlants.value.map((plant) => plant.id)
        }
      })
    } else {
      const meal = await $fetch('/api/meals', {
        method: 'POST',
        body: { name: mealName.value.trim() }
      })

      await $fetch('/api/meals/meal-plants', {
        method: 'POST',
        body: {
          meal_id: meal.id,
          plant_ids: selectedPlants.value.map((plant) => plant.id)
        }
      })
    }

    await refreshMeals()
    isPrimary.value = true
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
    <ElementWarning v-if="showLeaveWarning" @stay="cancelLeaveWarning" @leave="confirmLeaveWarning"/>

    <ElementToggle
      :model-value="isPrimary"
      primary-button-text="Deine Mahlzeiten"
      :secondary-button-text="isEditing ? 'Mahlzeit bearbeiten' : 'Mahlzeit erstellen'"
      class="grow min-h-0"
      @update:model-value="handleTabChange"
    >
      <template #primary>
        <div v-if="meals && meals.length > 0" class="flex flex-col gap-3 h-full min-h-0">
          <ElementMeal v-for="meal in meals" :key="meal.id" :name="meal.name" @open="openMealForEdit(meal)"/>
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
              v-for="plant in sortedSelectedPlants"
              :key="plant.id"
              :name="plant.name"
              :disabled="isEditing && selectedPlants.length <= 2"
              @remove="removePlant(plant.id)"
            />
          </div>

          <div v-if="saveError" role="alert" aria-live="polite" class="text-sm text-red-600 flex-none">
            {{ saveError }}
          </div>

          <ButtonPrimary class="w-full flex-none" :disabled="!canSave" @click="saveMeal">
            {{ isEditing ? 'Änderungen speichern' : 'Mahlzeit speichern' }}
          </ButtonPrimary>
        </div>
      </template>

    </ElementToggle>
  </div>
</template>
