<script setup lang="ts">
defineProps({
  primaryButtonText: String,
  secondaryButtonText: String
})

const primaryState = ref(true)
const secondaryState = ref(false)

function togglePrimary() {
  primaryState.value = true
  secondaryState.value = false
}

function toggleSecondary() {
  secondaryState.value = true
  primaryState.value = false
}
</script>

<template>
  <ElementBox>
    <div class="flex flex-row gap-2 mb-2">
      <div class="basis-1/2">
        <ButtonSecondary @click="togglePrimary" :state=primaryState
                         datatestid="primaryToggle">{{ primaryButtonText }}</ButtonSecondary>
      </div>
      <div class="basis-1/2">
        <ButtonSecondary @click="toggleSecondary" :state=secondaryState
                         datatestid="secondaryToggle">{{ secondaryButtonText }}</ButtonSecondary>
      </div>
    </div>

    <div v-if="primaryState">
      <slot name="primary"/>
    </div>
    <div v-if="secondaryState">
      <slot name="secondary"/>
    </div>
  </ElementBox>
</template>