import {createClient} from '@supabase/supabase-js'
import {serverSupabaseUser} from '#supabase/server'

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

    function getLocalDateString(date = new Date()): string {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6)

    const dateString = getLocalDateString(startDate)
    const userId = user.id || user.user_metadata?.sub

    const { data, error } = await supabase
        .from('daily_plants')
        .select('plant:plants!daily_plants_plant_fkey(*, plant_categories(*, categories(*)))')
        .eq('created_by', userId)
        .gte('created_at', dateString)

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    const seen = new Map<string, number>()
    for (const row of data || []) {
        const plant = row.plant
        const plantId = plant?.id
        if (!plantId || seen.has(plantId)) continue

        const plantCategories = plant.plant_categories
        const firstCategory = Array.isArray(plantCategories) ? plantCategories[0] : plantCategories
        const categoryData = firstCategory?.categories
        const categoryObj = Array.isArray(categoryData) ? categoryData[0] : categoryData

        const pointValue = categoryObj?.point_value ?? 1
        seen.set(plantId, Number(pointValue) || 1)
    }

    return {
        distinctPlantCount: seen.size,
        totalPoints: [...seen.values()].reduce((sum, v) => sum + v, 0),
    }
})