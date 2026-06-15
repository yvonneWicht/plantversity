<template>
  <div class="p-4 text-center w-screen h-screen">
    <h1 class="text-xl font-bold p-2">Login to plantversity!</h1>
    <p class="mb-4">
      A gamified Progressive Web App (PWA) that helps users track the diversity of plant-based foods they consume and
      motivates them to reach the goal of 30 different plants per week through progress tracking, badges, and
      educational
      insights.
    </p>

    <ElementButton buttonText="Login" @click="toggleSignIn"/>
    <div v-if="signIn">
      <form class="flex flex-col gap-1 mb-4" id="login-form" @submit.prevent="signInWithEmailPassword">
        <label for="login-email">E-Mail-Adresse:</label>
        <input
          class="bg-white p-2 border rounded"
          type="email"
          id="login-email"
          name="email"
          placeholder="E-Mail-Adresse"
          required
        />
        <label for="login-password">Passwort:</label>
        <input
          class="bg-white p-2 border rounded"
          type="password"
          id="login-password"
          name="password"
          placeholder="Passwort"
          required
        />
        <ElementButton type="submit" buttonText="Anmelden"/>
        <div v-if="errorMessage" id="message" role="alert" aria-live="polite" class="text-red-600">
          {{ errorMessage }}
        </div>
      </form>
    </div>

    <!-- Register Form -->
    <ElementButton buttonText="Registrieren" @click="toggleRegister"/>
    <div v-if="register">
      <form class="flex flex-col gap-1 mb-4" id="register-form" @submit.prevent="registerWithEmailPassword">
        <label for="register-email">E-Mail-Adresse:</label>
        <input
          class="bg-white p-2 border rounded"
          type="email"
          id="register-email"
          name="email"
          placeholder="E-Mail-Adresse"
          required
        />
        <label for="register-password">Passwort:</label>
        <input
          class="bg-white p-2 border rounded"
          type="password"
          id="register-password"
          name="password"
          placeholder="Passwort (min. 6 Zeichen)"
          minlength="6"
          required
        />
        <label for="display-name">Wie sollen wir dich nennen?:</label>
        <input
          class="bg-white p-2 border rounded"
          type="text"
          id="display-name"
          name="displayName"
          placeholder="Dein Name"
          required
        />
        <ElementButton type="submit" buttonText="Registrieren" class="bg-green-700"/>
        <div v-if="registerMessage" id="message" role="alert" aria-live="polite"
             :class="registerMessage.includes('erfolgreich') ? 'text-green-600' : 'text-red-600'">
          {{ registerMessage }}
        </div>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
const { currentUser, isLoggedIn, loginAsDev, isDevelopment, mockAuthEnabled } = useAuth()

// Weiterleitung wenn bereits eingeloggt
watchEffect(() => {
  if (isLoggedIn.value) {
    navigateTo('/dashboard')
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      errorMessage.value = 'Login fehlgeschlagen. Überprüfen Sie E-Mail und Passwort.'
      console.error('Login error:', error)
      return
    }

    // Erfolgreicher Login -> Weiterleitung erfolgt durch watchEffect
    console.log('Login erfolgreich:', data.user?.email)

  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
  }
}

// Registrierung mit E-Mail + Passwort
async function registerWithEmailPassword(event: Event) {
  const form = event.target as HTMLFormElement
  const email = (form.email as HTMLInputElement).value
  const password = (form.password as HTMLInputElement).value  // ← Passwort aus dem Formular
  const displayName = (form.displayName as HTMLInputElement).value

  registerMessage.value = ''

  try {
    // 1. Erstmal prüfen ob Email bereits existiert (über Server-API)
    const response = await $fetch('/api/check-email', {
      method: 'POST',
      body: { email }  // ← Nur E-Mail, KEIN Passwort an den Server!
    })

    if (response.exists) {
      registerMessage.value = 'Diese E-Mail-Adresse ist bereits registriert. Verwenden Sie stattdessen die Login-Funktion.'
      return
    }

    // 2. Registrierung DIREKT mit Supabase (Frontend → Supabase)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,  // ← HIER wird das Passwort direkt an Supabase gesendet
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

    registerMessage.value = 'Registrierung erfolgreich! Sie können sich jetzt anmelden.'

  } catch (error) {
    console.error('Fehler bei der Registrierung:', error)
    registerMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
  }
}

// UI State
const signIn = ref(false)
const register = ref(false)

function toggleSignIn() {
  signIn.value = !signIn.value
  register.value = false
  errorMessage.value = ''
}

function toggleRegister() {
  register.value = !register.value
  signIn.value = false
  registerMessage.value = ''
}
</script>