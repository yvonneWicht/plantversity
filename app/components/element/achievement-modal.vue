<!--This modal informs the user about a newly reached achievement-->

<script setup lang="ts">
const { pending, dismiss } = useAchievements()

const current = computed(() => ACHIEVEMENTS.find(a => a.key === pending.value[0]))

async function showAchievements() {
  dismiss()
  await navigateTo('/achievements')
}
</script>

<template>
  <div v-if="current" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40">
    <div class="flex flex-col w-full bg-white text-primary-green rounded-3xl text-center gap-3 p-2">
      <div class="text-lg font-extrabold">Neuer Erfolg freigeschaltet!</div>
      <img :src="getBadgeImage(current.key, true)" :alt="current.title" class="h-32 mx-auto">
      <div>{{ current.description }}</div>
      <ButtonPrimary type="button" class="w-full" @click="dismiss">Schließen</ButtonPrimary>
      <ButtonPrimary type="button" class="w-full" @click="showAchievements">Zu den Erfolgen gehen</ButtonPrimary>
    </div>
  </div>
</template>
