<script setup lang="ts">
defineProps({
  headline: String
})
</script>

<template>
  <div>
    <div v-if="headline" class="bg-primary-green text-white rounded-t-3xl p-1 text-center">{{ headline }}
    </div>
    <div :class="headline ? ' rounded-b-3xl' : 'rounded-3xl'"
         class="bg-white/80 p-2">
      <slot/>
    </div>
  </div>
</template>