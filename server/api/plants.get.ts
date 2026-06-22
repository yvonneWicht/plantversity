import {createClient} from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
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

    const {search} = getQuery(event)

    // Make a request
    const {data: plants, error} = await supabase
        .from('plants')
        .select('*')
        .ilike('name', `%${search}%`)
        .limit(10)

    return plants;
})