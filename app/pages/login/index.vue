<script setup lang="ts">

definePageMeta({
  layout: 'login',
})

const {isLoggedIn} = useAuth()

// Weiterleitung wenn bereits eingeloggt
watchEffect(() => {
  if (isLoggedIn.value) {
    navigateTo('/')
  }
})

const supabase = useSupabaseClient()
const errorMessage = ref('')
const registerMessage = ref('')

// Login mit E-Mail + Passwort
async function signInWithEmailPassword(event: Event) {
  const form = event.target as HTMLFormElement
  const email = (form.email as HTMLInputElement).value
  const password = (form.password as HTMLInputElement).value

  errorMessage.value = ''

  try {
    const {error} = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      errorMessage.value = 'Login fehlgeschlagen. Überprüfe E-Mail und Passwort.'
      return
    }

  } catch {
    errorMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
  }
}

// Registrierung mit E-Mail + Passwort + Name
async function registerWithEmailPassword(event: Event) {
  const form = event.target as HTMLFormElement
  const email = (form.email as HTMLInputElement).value
  const password = (form.password as HTMLInputElement).value  // ← Passwort aus dem Formular
  const displayName = (form.displayName as HTMLInputElement).value

  registerMessage.value = ''

  try {
    // Prüfen ob Email bereits existiert (Server-API)
    const response = await $fetch('/api/check-email', {
      method: 'POST',
      body: {email}  // ← Nur E-Mail, KEIN Passwort an den Server!
    })

    if (response.exists) {
      registerMessage.value = 'Diese E-Mail-Adresse ist bereits registriert. Verwende den Login.'
      return
    }

    // Registrierung mit Supabase (Frontend → Supabase)
    const {error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: displayName,
          display_name: displayName,
          firstName: displayName
        }
      }
    })

    if (error) {
      registerMessage.value = `Registrierung fehlgeschlagen: ${error.message}`
      return
    }

    registerMessage.value = 'Bestätige deine Mail-Adresse über den Link in der E-Mail um die Registrierung abzuschließen.'

  } catch {
    registerMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
  }
}

const isLoginActive = ref(true)

// Optional: Meldungen zurücksetzen, wenn der Tab gewechselt wird
watch(isLoginActive, () => {
  errorMessage.value = ''
  registerMessage.value = ''
})
</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <h1 class="text-3xl font-bold">Willkommen bei Plantversity!</h1>

    <IconPlantJar class="h-1/3 justify-self-center"/>

    <div class="h-[45vh] sticky bottom-0 left-6 right-6">
      <ElementToggle
        v-model="isLoginActive"
        primary-button-text="Login"
        secondary-button-text="Registrieren"
      >
        <template #primary>
          <div v-if="errorMessage" id="signIn-message" role="alert" aria-live="polite" class="text-sm pb-2 text-red-600">
            {{ errorMessage }}
          </div>
          <form id="login-form" class="flex flex-col gap-3" @submit.prevent="signInWithEmailPassword">
            <FormInput id="login-email" type="email" name="email" placeholder="E-Mail-Adresse" required/>
            <FormInput id="login-password" type="password" name="password" placeholder="Passwort" required/>
            <ButtonPrimary type="submit">Anmelden</ButtonPrimary>
          </form>
        </template>
        <template #secondary>
          <div
            v-if="registerMessage"
            id="register-message"
            role="alert"
            aria-live="polite"
            class="text-sm pb-2"
            :class="registerMessage.includes('abzuschließen') ? 'text-green-600' : 'text-red-600'"
          >
            {{ registerMessage }}
          </div>
          <form v-if="!registerMessage.includes('abzuschließen')" id="register-form" class="flex flex-col gap-3" @submit.prevent="registerWithEmailPassword">
            <FormInput id="register-email" type="email" name="email" placeholder="E-Mail-Adresse" required/>
            <FormInput id="register-password" type="password" name="password" placeholder="Passwort (min. 6 Zeichen)" minlength="6" required/>
            <FormInput id="register-display-name" type="text" name="displayName" placeholder="Wie sollen wir dich nennen?" required/>
            <ButtonPrimary type="submit">Registrieren</ButtonPrimary>
          </form>
        </template>
      </ElementToggle>
    </div>
  </div>
</template>