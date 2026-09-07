<script setup lang="ts">
defineProps<{
  primaryButtonText?: string
  secondaryButtonText?: string
}>()

const isPrimary = defineModel<boolean>({ default: true })
</script>

<template>
  <ElementBox>
    <div class="flex flex-row gap-2 mb-2">
      <div class="basis-1/2">
        <ButtonSecondary
          :state="isPrimary"
          class="w-full"
          data-testid="primaryToggle"
          @click="isPrimary = true"
        >
          {{ primaryButtonText }}
        </ButtonSecondary>
      </div>
      <div class="basis-1/2">
        <ButtonSecondary
          :state="!isPrimary"
          class="w-full"
          data-testid="secondaryToggle"
          @click="isPrimary = false"
        >
          {{ secondaryButtonText }}
        </ButtonSecondary>
      </div>
    </div>

    <div v-if="isPrimary">
      <slot name="primary" />
    </div>
    <div v-else>
      <slot name="secondary" />
    </div>
  </ElementBox>
</template>