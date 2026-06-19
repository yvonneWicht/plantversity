<script setup lang="ts">
const { link, icon } = defineProps<{
  link: string
  icon: string
}>()

const route = useRoute()

const isCurrentRoute = computed(() => route.path === link)
</script>

<template>
  <NuxtLink :to="link">
    <div class="flex flex-col items-center">
      <Icon
        :name="icon"
        size="40px"
        :class="isCurrentRoute ? 'text-primary-green' : 'text-primary-green/40'"
      />
      <p>
        <slot/>
      </p>
    </div>
  </NuxtLink>
</template>