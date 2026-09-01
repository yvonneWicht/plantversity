<!--This layout is used for every page except the login screen and shows the navigation elements-->

<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col h-svh py-2 px-3">
    <div class="flex flex-col grow min-h-0">
      <NavigationTop/>

      <div class="flex flex-col grow min-h-0">
        <slot />
      </div>

    </div>
    <div class="flex-none">
      <NavigationMain/>
    </div>
  </div>
</template>