import { serverSupabaseUser } from '#supabase/server'

// Prüft die Erfolge, speichert neu erreichte und gibt deren Keys zurück
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const userId = user.id || user.user_metadata?.sub
    const supabase = createServiceClient()

    const reached = await evaluateAchievements(supabase, userId)

    const { data: existing, error } = await supabase
        .from('user_achievements')
        .select('achievement_key')
        .eq('user_id', userId)
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    const known = new Set((existing ?? []).map(row => row.achievement_key))
    const newlyReached = reached.filter(key => !known.has(key))

    if (newlyReached.length > 0) {
        const { error: insertError } = await supabase
            .from('user_achievements')
            .upsert(newlyReached.map(key => ({ user_id: userId, achievement_key: key })), {
                onConflict: 'user_id,achievement_key',
                ignoreDuplicates: true
            })
        if (insertError) throw createError({ statusCode: 500, statusMessage: insertError.message })
    }

    return newlyReached
})
