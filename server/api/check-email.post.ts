
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    try {
        // Request body lesen
        const body = await readBody(event)
        const { email } = body

        console.log('API Route aufgerufen mit:', body)
        console.log('Environment vars:', {
            url: process.env.NUXT_PUBLIC_SUPABASE_URL,
            hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        })

        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Email ist erforderlich'
            })
        }

        // Supabase Admin Client erstellen (du brauchst den Service Role Key!)
        const supabase = createClient(
            process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://kgwunclxpepbuosbdain.supabase.co',
            process.env.SUPABASE_SERVICE_ROLE_KEY!, // Das fehlt wahrscheinlich!
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Alle Benutzer abrufen und nach Email suchen
        const { data: users, error } = await supabase.auth.admin.listUsers()

        if (error) {
            console.error('Supabase Error:', error)
            throw createError({
                statusCode: 500,
                statusMessage: 'Fehler beim Abrufen der Benutzerdaten'
            })
        }

        // Prüfen ob Email bereits existiert
        const emailExists = users.users.some(user => user.email === email)

        return {
            exists: emailExists,
            message: emailExists ? 'E-Mail-Adresse bereits registriert' : 'E-Mail-Adresse verfügbar'
        }

    } catch (error) {
        console.error('API Error:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Server-Fehler bei der Email-Prüfung'
        })
    }
})