<script setup lang="ts">
defineProps({
  headline: String
})
</script>

<template>
  <div>
    <div v-if="headline" class="bg-primary-green text-white rounded-t-4xl p-4 text-center">{{ headline }}
    </div>
    <div :class="headline ? ' rounded-b-4xl p-4' : 'rounded-4xl'"
         class="bg-white/80 p-4">
      <slot/>
    </div>
  </div>
</template>