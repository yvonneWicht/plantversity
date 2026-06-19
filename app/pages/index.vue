<template>
  <div class="flex flex-col gap-8">
    <IconPlantJar class="grow justify-self-center px-16"/>

    <ElementProgressBar/>

    <ElementToggle primaryButtonText="Pflanzen" secondaryButtonText="Mahlzeiten">
      <template #primary>
          <FormSearch type="text" id="plant-search" name="plant-search" placeholder="Pflanze suchen"/>
      </template>
      <template #secondary>
        <FormSearch type="text" id="plant-search" name="plant-search" placeholder="Mahlzeit suchen"/>
      </template>
    </ElementToggle>


    <ElementBox headline="Heute gegessen" class="min-h-[200px]">
      Content<br>
      Content<br>
      Content<br>
      Content<br>
      Content<br>
    </ElementBox>
  </div>

</template>

<script setup lang="ts">
import Search from "~/components/form/search.vue";
</script>