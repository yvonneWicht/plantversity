<script setup lang="ts">
const {currentUser, logout} = useAuth()

definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div class="flex flex-row justify-between">
    <!--        <span v-if="currentUser">Hallo {{ currentUser.user_metadata?.display_name }}!</span>-->
    <Icon name="material-symbols:help-outline" size="45px" @click="useRouter().push('/faq')"/>
    <Icon name="material-symbols:logout" size="45px" @click="logout"/>
  </div>
</template>