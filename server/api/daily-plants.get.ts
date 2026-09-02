import {createClient} from '@supabase/supabase-js'
import {serverSupabaseUser} from '#supabase/server'

export default defineEventHandler(async (event) => {
    // User aus der Session lesen -> Route ist nur für eingeloggte User nutzbar
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const query = getQuery(event)
    const range = (query.range as string) || 'today'

    // Authentication to Supabase, needed to make database requests
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

    if (range === '7days') {
        startDate.setDate(startDate.getDate() - 6)
    }

    const dateString = getLocalDateString(startDate)


    const { data: dailyPlants, error } = await supabase
        .from('daily_plants')
        .select('*, plant:plants!daily_plants_plant_fkey(*)')
        .eq('created_by', user?.user_metadata?.sub)
        .gte('created_at', dateString)


    console.log(user?.user_metadata?.sub)
    console.log('Daily Plants:', dailyPlants)
    console.log('Error:', error)
    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }

    dailyPlants.sort((a, b) =>
        (a.plant?.name ?? '').localeCompare(b.plant?.name ?? '', 'de')
    )
    return dailyPlants
})
