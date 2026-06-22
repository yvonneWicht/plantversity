<template>
  <div class="flex flex-col gap-3">
    <IconPlantJar class="grow justify-self-center px-16"/>

    <ElementProgressBar/>

    <ElementToggle primaryButtonText="Pflanzen" secondaryButtonText="Mahlzeiten">
      <template #primary>
          <FormSearch v-model="search" type="text" id="plant-search" name="plant-search" placeholder="Pflanze suchen"/>
      </template>
      <template #secondary>
        <FormSearch v-model="search" ype="text" id="plant-search" name="plant-search" placeholder="Mahlzeit suchen"/>
      </template>
    </ElementToggle>


    <ElementBox headline="Heute gegessen" class="max-h-[150px]">
      Content<br>
      Content<br>
      Content<br>
    </ElementBox>
  </div>

</template>

<script setup lang="ts">
  const search = ref('')
</script>