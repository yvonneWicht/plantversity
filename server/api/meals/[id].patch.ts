import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const mealId = getRouterParam(event, 'id')
    if (!mealId) {
        throw createError({ statusCode: 400, statusMessage: 'Mahlzeit-ID ist erforderlich' })
    }

    const body = await readBody(event)
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const plantIds = Array.isArray(body?.plant_ids)
        ? body.plant_ids.filter((id: unknown): id is string => typeof id === 'string')
        : []

    if (!name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Name der Mahlzeit ist erforderlich'
        })
    }

    if (plantIds.length < 2) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Eine Mahlzeit benötigt mindestens 2 Pflanzen'
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
        throw createError({ statusCode: 500, statusMessage: mealError.message })
    }

    if (!meal) {
        throw createError({ statusCode: 403, statusMessage: 'Mahlzeit nicht gefunden' })
    }

    const { data: nameConflict, error: nameCheckError } = await supabase
        .from('meals')
        .select('id')
        .eq('created_by', user.sub)
        .eq('name', name)
        .neq('id', mealId)
        .maybeSingle()

    if (nameCheckError) {
        console.error('Fehler bei der Namensprüfung:', nameCheckError)
        throw createError({ statusCode: 500, statusMessage: nameCheckError.message })
    }

    if (nameConflict) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Eine Mahlzeit mit diesem Namen existiert bereits'
        })
    }

    const { error: updateError } = await supabase
        .from('meals')
        .update({ name })
        .eq('id', mealId)

    if (updateError) {
        console.error('Fehler beim Aktualisieren der Mahlzeit:', updateError)
        throw createError({ statusCode: 500, statusMessage: updateError.message })
    }

    // Bisherige Pflanzen-Verknüpfungen vollständig durch die aktuelle Auswahl ersetzen
    const { error: deleteError } = await supabase
        .from('meal_plants')
        .delete()
        .eq('meal_id', mealId)

    if (deleteError) {
        console.error('Fehler beim Entfernen der bisherigen Pflanzen:', deleteError)
        throw createError({ statusCode: 500, statusMessage: deleteError.message })
    }

    const { error: insertError } = await supabase
        .from('meal_plants')
        .insert(plantIds.map((plantId: string) => ({
            meal_id: mealId,
            plant_id: plantId
        })))

    if (insertError) {
        console.error('Fehler beim Verknüpfen der Pflanzen mit der Mahlzeit:', insertError)
        throw createError({ statusCode: 500, statusMessage: insertError.message })
    }

    return { id: mealId, name }
})
