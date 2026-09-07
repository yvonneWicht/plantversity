import { createClient } from '@supabase/supabase-js'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

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

    // !inner sorgt dafür, dass nur Mahlzeiten mit mindestens einer verknüpften Pflanze zurückgegeben werden
    const { data: meals, error } = await supabase
        .from('meals')
        .select('id, name, created_at, meal_plants!inner(plant:plants(id, name))')
        .eq('created_by', user.sub)

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }

    const result = meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        createdAt: meal.created_at,
        plants: meal.meal_plants.map((mealPlant) => mealPlant.plant)
    }))

    result.sort((a, b) => a.name.localeCompare(b.name, 'de'))

    return result
})
