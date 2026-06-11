<script>
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://your-project-id.supabase.co', 'sb_publishable_...')
// ---cut---
const { error } = await supabase.auth.verifyOtp({
  token_hash: 'hash',
  type: 'email',
})
</script>

<template>
  <div class="p-4 text-center w-screen h-screen">
    <h1 class="text-xl font-bold p-2">Login confirmed</h1>
    <p>
      A gamified Progressive Web App (PWA) that helps users track the diversity of plant-based foods they consume and
      motivates them to reach the goal of 30 different plants per week through progress tracking, badges, and
      educational
      insights.
    </p>
  </div>
</template>
<script setup lang="ts">
</script>