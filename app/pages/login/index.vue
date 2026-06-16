<template>
  <div class="p-4 text-center w-screen h-screen p-6 flex flex-col justify-between">
    <h1 class="text-6xl/20 font-bold">Willkommen bei Plantversity!</h1>

    <IconPlantjar class="h-1/3 justify-self-center"/>

    <p class="text-2xl">
      Ernähre dich vielfältig und gesund. Und das mit Spaß.<br>
      Sammle Plant Points um deine wöchentliche Vielfalt von Pflanzen zu erhöhen!<br>
      Fülle dein Plant Jar und sammle Erfolge in dem du in 7 Tagen 30 verschiedene pflanzliche Lebensmittel isst.
    </p>

    <div class="h-[37vh] sticky bottom-0 left-6 right-6">
    <div class="p-2 bg-white/80 rounded-4xl p-4">
      <div class="flex flex-row gap-3 mb-3">
        <div class="basis-1/2">
          <ElementButtonSecondary buttonText="Login" @click="toggleSignIn" :state="signIn" datatestid="login-button"/>
        </div>
        <div class="basis-1/2">
          <ElementButtonSecondary buttonText="Registrieren" @click="toggleRegister" :state="register" datatestid="register-button"/>
        </div>
      </div>

      <div v-if="signIn">
        <div v-if="errorMessage" id="message" role="alert" aria-live="polite" class="text-red-600">
          {{ errorMessage }}
        </div>
        <form class="flex flex-col gap-3" id="login-form" @submit.prevent="signInWithEmailPassword">
          <FormInput type="email" id="login-email" name="email" placeholder="E-Mail-Adresse" required/>
          <FormInput type="password" id="login-password" name="password" placeholder="Passwort" required/>
          <ElementButtonPrimary type="submit" buttonText="Anmelden"/>
        </form>
      </div>

      <!-- Register Form -->
      <div v-if="register">
        <div v-if="registerMessage" id="message" role="alert" aria-live="polite" class="text-2xl pb-6"
             :class="registerMessage.includes('abzuschließen') ? 'text-green-600' : 'text-red-600'">
          {{ registerMessage }}
        </div>
        <form v-if="!registerMessage.includes('abzuschließen')" class="flex flex-col gap-3" id="register-form" @submit.prevent="registerWithEmailPassword">
          <FormInput type="email" id="register-email" name="email" placeholder="E-Mail-Adresse" required/>
          <FormInput type="password" id="register-password" name="password" placeholder="Passwort (min. 6 Zeichen)" minlength="6" required/>
          <FormInput type="text" id="register-display-name" name="displayName" placeholder="Wie sollen wir dich nennen?" required/>
          <ElementButtonPrimary type="submit" buttonText="Registrieren"/>
        </form>
      </div>
    </div>
    </div>
  </div>
</template>


<script setup lang="ts">
const {currentUser, isLoggedIn} = useAuth()

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
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      errorMessage.value = 'Login fehlgeschlagen. Überprüfe E-Mail und Passwort.'
      return
    }

  } catch (error) {
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
    const {data, error} = await supabase.auth.signUp({
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

  } catch (error) {
    registerMessage.value = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.'
  }
}

// UI State
const signIn = ref(true)
const register = ref(false)

function toggleSignIn() {
  signIn.value = true
  register.value = false
  errorMessage.value = ''
}

function toggleRegister() {
  register.value = true
  signIn.value = false
  registerMessage.value = ''
}
</script>