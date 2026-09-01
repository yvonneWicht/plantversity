<!--This Box component is used to structure the frontend through a white background with an optional headline-->

<script setup lang="ts">
defineProps({
  headline: String
})
</script>

<template>
  <div class="flex flex-col">
<!--    To show the headline fill the headline prop-->
    <div v-if="headline" class="flex-none bg-primary-green text-white rounded-t-3xl p-1 text-center">{{ headline }}
    </div>
    <div :class="headline ? ' rounded-b-3xl' : 'rounded-3xl'"
         class="grow bg-white/80 p-2 min-h-0 flex flex-col">
      <slot/>
    </div>
  </div>
</template>