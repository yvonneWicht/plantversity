// composables/useAuth.ts
export const useAuth = () => {
    const config = useRuntimeConfig()
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const isDevelopment = config.public.isDevelopment
    const mockAuthEnabled = config.public.mockAuthEnabled

    // Echte Dev-User Credentials
    const devUserCredentials = {
        email: 'dev@plantversity.local',
        password: 'DevPassword123!'
    }

    // Aktueller User
    const currentUser = computed(() => {
        return user.value
    })

    // Login-Status prüfen
    const isLoggedIn = computed(() => {
        return !!user.value
    })

    // Dev Login mit echtem Supabase User
    const loginAsDev = async () => {
        if (isDevelopment) {
            try {
                console.log('🔧 Development: Logging in as dev user...')

                // Versuche Login mit vorhandenem Dev-User
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: devUserCredentials.email,
                    password: devUserCredentials.password
                })

                if (error && error.message.includes('Invalid login credentials')) {
                    // Dev-User existiert noch nicht - erstellen
                    console.log('🔧 Creating dev user...')
                    const { error: signUpError } = await supabase.auth.signUp({
                        email: devUserCredentials.email,
                        password: devUserCredentials.password,
                        options: {
                            data: {
                                name: 'Dev User',
                                display_name: 'Dev User',
                                firstName: 'Dev'
                            }
                        }
                    })

                    if (!signUpError) {
                        // Nach Registrierung einloggen
                        await supabase.auth.signInWithPassword({
                            email: devUserCredentials.email,
                            password: devUserCredentials.password
                        })
                    }
                } else if (error) {
                    console.error('Dev login error:', error)
                    return
                }

                localStorage.setItem('dev-mock-auth', 'true')
                return navigateTo('/dashboard')

            } catch (err) {
                console.error('Dev authentication error:', err)
            }
        }
    }

    // Logout
    const logout = async () => {
        await supabase.auth.signOut()
        if (isDevelopment) {
            localStorage.removeItem('dev-mock-auth')
            console.log('🔧 Development: Logged out')
        }
        return navigateTo('/login')
    }

    return {
        currentUser,
        isLoggedIn,
        loginAsDev,
        logout,
        supabase,
        isDevelopment,
        mockAuthEnabled
    }
}