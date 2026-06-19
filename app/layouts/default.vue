<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-screen p-4">
    <div class="grow">
      <NavigationTop/>

      <slot />

    </div>
    <div>
      <NavigationMain/>
    </div>
  </div>
</template>