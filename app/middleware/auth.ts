// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const { isLoggedIn } = useAuth()

    if (!isLoggedIn.value) {
        return navigateTo('/login')
    }
})