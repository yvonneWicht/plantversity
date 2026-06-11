<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://kgwunclxpepbuosbdain.supabase.co',
    'sb_publishable_Q18Bgcs3xhdU0ZY38b_g1g_N5k3z807'
)

async function signInWithEmail(event: Event) {
  console.log("signIn");
  const form = event.target as HTMLFormElement
  const email = (form.email as HTMLInputElement).value

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: 'http://localhost:3000/confirm',
    },
  })

  console.log("SignIn", { data, error })
}
</script>

<template>
  <div class="p-4 text-center w-screen h-screen">
    <h1 class="text-xl font-bold p-2">Login to plantversity!</h1>
    <p>
      A gamified Progressive Web App (PWA) that helps users track the diversity of plant-based foods they consume and
      motivates them to reach the goal of 30 different plants per week through progress tracking, badges, and
      educational
      insights.
      <IconsLeaf />
    </p>
<!--    TODO: Mail-Adresse eingeben und Sign-In Button erstellen, der die signInWithEmail Funktion aufruft-->
<!--    https://supabase.com/docs/guides/auth/auth-email-passwordless-->
    <form id="login-form" @submit.prevent="signInWithEmail">
      <label for="email">E-Mail-Adresse:</label>
      <input type="email" id="email" name="email" required />
      <button type="submit">Einloggen</button>
      <div id="message" role="alert" aria-live="polite"></div>
    </form>
  </div>
</template>
<script setup lang="ts">
</script>