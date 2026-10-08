<script setup lang="ts">
const {logout, currentUser, supabase} = useAuth()

definePageMeta({
  middleware: 'auth'
})

// Das Registrierungsdatum ist nicht im JWT enthalten und wird deshalb über die Auth-API geladen
const {data: authUser} = await useAsyncData('account-user', async () => {
  const {data} = await supabase.auth.getUser()
  return data.user
})

const displayName = computed(() => currentUser.value?.user_metadata?.display_name ?? authUser.value?.user_metadata?.display_name ?? '-')
const email = computed(() => currentUser.value?.email ?? authUser.value?.email ?? '-')
const createdAt = computed(() => authUser.value?.created_at
    ? new Date(authUser.value.created_at).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'})
    : '-')
</script>

<template>
  <ElementBox headline="Account-Infos" class="grow min-h-0">
      <div class="flex flex-col content-end h-full">
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 grow content-start">
          <dt class="font-bold">Benutzer-Name:</dt>
          <dd class="break-all">{{ displayName }}</dd>
          <dt class="font-bold">E-Mail:</dt>
          <dd class="break-all">{{ email }}</dd>
          <hr class="col-span-2 my-1">
          <dt class="font-bold">Registriert seit:</dt>
          <dd>{{ createdAt }}</dd>
        </dl>
        <ButtonPrimary type="button" class="w-full flex gap-2 justify-center items-center" @click="logout">
        Logout
        <Icon name="material-symbols-light:logout" size="28px"/>
        </ButtonPrimary>
      </div>
  </ElementBox>
</template>
