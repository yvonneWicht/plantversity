import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const body = await readBody(event)
    const name = typeof body?.name === 'string' ? body.name.trim() : ''

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name der Mahlzeit ist erforderlich'
        })
    }

    const supabase = createClient(
        process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://kgwunclxpepbuosbdain.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const { data, error } = await supabase
        .from('meals')
        .insert({
            name,
            created_by: user.sub
        })
        .select()
        .single()

    if (error) {
        if (error.code === '23505') {
            throw createError({
                statusCode: 409,
                statusMessage: 'Eine Mahlzeit mit diesem Namen existiert bereits'
            })
        }

        console.error('Fehler beim Anlegen der Mahlzeit:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }

    return data
})
