<script setup lang="ts">
defineProps({
  type: String,
  id: String,
  name: String,
  placeholder: String,
})

  const search = defineModel<string>()
  const results = ref<any[]>([])


  watch(search, async (value) => {
    console.log(search.value)
    if (value.length < 3) {
      results.value = []
      return
    }

    const response = await $fetch(`/api/plants`, {
      query: {
        search: value
      }
    })

    results.value = response

  })

function selectPlant(plant: {name: string }) {
  search.value = plant.name
  results.value = []
}
</script>

<template>
  <form class="relative">
    <FormInput
      v-model="search"
      :type=type
      :id=id
      :name=name
      :placeholder=placeholder
      class="w-full pr-16"
    />

    <ButtonPrimary
      class="absolute right-0 top-1/2 -translate-y-1/2 h-full aspect-square"
      @click=""
    >
      +
    </ButtonPrimary>
  </form>
  <div v-if="results.length > 0" class="">
    <ul>
      <li v-for="result in results" :key="result.id">
        <button @click="selectPlant(result)">
          {{ result.name }}
        </button>
      </li>
    </ul>
  </div>
</template>