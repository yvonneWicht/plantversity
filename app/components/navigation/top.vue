<script setup lang="ts">
const {currentUser, logout} = useAuth()

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="flex flex-row justify-between -mb-6">
    <!--        <span v-if="currentUser">Hallo {{ currentUser.user_metadata?.display_name }}!</span>-->
    <Icon name="material-symbols-light:help-outline" size="36px" @click="useRouter().push('/faq')"/>
    <Icon name="material-symbols-light:logout" size="36px" @click="logout"/>
  </div>
</template>