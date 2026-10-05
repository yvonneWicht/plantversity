import { serverSupabaseUser } from '#supabase/server'

// Liefert die Keys aller bereits erreichten Erfolge des Nutzers
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const { data, error } = await createServiceClient()
        .from('user_achievements')
        .select('achievement_key')
        .eq('user_id', user.id || user.user_metadata?.sub)

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    return (data ?? []).map(row => row.achievement_key as AchievementKey)
})
