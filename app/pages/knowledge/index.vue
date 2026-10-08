<!--This page shows short knowledge articles about plant categories. Articles are maintained as markdown files in app/content/knowledge-->

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <ElementBox headline="Wissen" class="grow min-h-0">
    <div class="flex flex-col gap-3 grow min-h-0 overflow-y-auto">
      <article
        v-for="article in KNOWLEDGE_ARTICLES"
        :key="article.slug"
        class="rounded-2xl bg-white p-3 border-t-8"
        :style="{ borderColor: CATEGORY_COLORS[article.category] ?? FALLBACK_COLOR }"
      >
        <h2 class="font-bold mb-1">{{ article.title }}</h2>
        <p v-for="(paragraph, index) in article.paragraphs" :key="index" class="text-sm mb-2">{{ paragraph }}</p>
      </article>
    </div>
    <p class="flex-none text-xs text-center pt-2 text-primary-green/70">
      Die Inhalte dieser Seite wurden mittels KI generiert und dienen als Platzhalter für reale Inhalte.
    </p>
  </ElementBox>
</template>
