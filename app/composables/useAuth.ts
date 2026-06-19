// composables/useAuth.ts
export const useAuth = () => {
    const config = useRuntimeConfig()
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    // Aktueller User
    const currentUser = computed(() => {
        return user.value
    })

    // Login-Status prüfen
    const isLoggedIn = computed(() => {
        return !!user.value
    })

    // Logout
    const logout = async () => {
        await supabase.auth.signOut()
        return navigateTo('/login')
    }

    return {
        currentUser,
        isLoggedIn,
        logout,
        supabase
    }
}