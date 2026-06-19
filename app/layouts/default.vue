<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-svh py-2 px-3">
    <div class="grow">
      <NavigationTop/>

      <slot />

    </div>
    <div>
      <NavigationMain/>
    </div>
  </div>
</template>