import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const body = await readBody(event)
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const excludeId = typeof body?.excludeId === 'string' ? body.excludeId : undefined

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name ist erforderlich'
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

    let query = supabase
        .from('meals')
        .select('id')
        .eq('created_by', user.sub)
        .eq('name', name)

    if (excludeId) {
        query = query.neq('id', excludeId)
    }

    const { data: existingMeal, error } = await query.maybeSingle()

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }

    return { exists: Boolean(existingMeal) }
})
