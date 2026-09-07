import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)
        const { email } = body

        if (!email) {
            throw createError({
                statusCode: 400,
                statusMessage: 'E-Mail-Adresse ist erforderlich'
            })
        }

        const supabase = createClient(
            process.env.NUXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Direkte O(1) Index-Abfrage über Postgres RPC
        const { data: exists, error } = await supabase.rpc('check_email_exists', {
            lookup_email: email
        })

        if (error) {
            console.error('Supabase RPC Error:', error)
            throw createError({
                statusCode: 500,
                statusMessage: 'Fehler bei der E-Mail-Prüfung'
            })
        }

        return {
            exists: Boolean(exists),
            message: exists ? 'E-Mail-Adresse bereits registriert' : 'E-Mail-Adresse verfügbar'
        }
    } catch (error: unknown) {
        console.error('API Error:', error)
        const err = error as { statusCode?: number; statusMessage?: string; message?: string }
        throw createError({
            statusCode: err?.statusCode || 500,
            statusMessage: err?.statusMessage || err?.message || 'Server-Fehler bei der Email-Prüfung'
        })
    }
})