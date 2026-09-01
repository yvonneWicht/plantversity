// TODO: Route must be available only for logged in users

import { createClient } from '@supabase/supabase-js'

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

    const body = await readBody(event)

    // 1. Check if an entry already exists for this user, plant, and date
    const { data: existingEntry, error: checkError } = await supabase
        .from('daily_plants')
        .select('id')
        .eq('plant', body.plant)
        .eq('created_by', body.created_by)
        .eq('created_at', body.created_at)
        .maybeSingle()

    if (checkError) {
        throw createError({
            statusCode: 500,
            statusMessage: checkError.message
        })
    }

    // If already present, return early without inserting a duplicate
    if (existingEntry) {
        return existingEntry
    }

    // 2. Insert new entry if not present
    const { data, error } = await supabase
        .from('daily_plants')
        .insert(body)
        .select()

    if (error) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }

    return data
})