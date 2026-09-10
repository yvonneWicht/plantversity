import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const body = await readBody(event)
    const mealId = typeof body?.meal_id === 'string' ? body.meal_id : ''
    const plantIds = Array.isArray(body?.plant_ids)
        ? body.plant_ids.filter((id: unknown): id is string => typeof id === 'string')
        : []

    if (!mealId || plantIds.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'meal_id und plant_ids sind erforderlich'
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

    // Sicherstellen, dass die Mahlzeit dem anfragenden Nutzer gehört
    const { data: meal, error: mealError } = await supabase
        .from('meals')
        .select('id')
        .eq('id', mealId)
        .eq('created_by', user.sub)
        .maybeSingle()

    if (mealError) {
        console.error('Fehler bei der Besitzer-Prüfung der Mahlzeit:', mealError)
        throw createError({
            statusCode: 500,
            statusMessage: mealError.message
        })
    }

    if (!meal) {
        throw createError({ statusCode: 403, statusMessage: 'Mahlzeit nicht gefunden' })
    }

    const { data, error } = await supabase
        .from('meal_plants')
        .insert(plantIds.map((plantId: string) => ({
            meal_id: mealId,
            plant_id: plantId
        })))
        .select()

    if (error) {
        console.error('Fehler beim Verknüpfen der Pflanzen mit der Mahlzeit:', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }

    return data
})
