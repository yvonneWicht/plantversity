import { createClient } from '@supabase/supabase-js'
import { getStartDateForRange } from './date'

export function createServiceClient() {
    return createClient(
        process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://kgwunclxpepbuosbdain.supabase.co',
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

interface TrackedEntry {
    date: string
    plantId: string
    categoryId: string | null
}

const PAGE_SIZE = 1000

async function loadEntries(supabase: ReturnType<typeof createServiceClient>, userId: string): Promise<TrackedEntry[]> {
    const entries: TrackedEntry[] = []
    for (let from = 0; ; from += PAGE_SIZE) {
        const { data, error } = await supabase
            .from('daily_plants')
            .select('id, created_at, plant:plants!daily_plants_plant_fkey(id, plant_categories(categories(id)))')
            .eq('created_by', userId)
            .order('id')
            .range(from, from + PAGE_SIZE - 1)
        if (error) throw createError({ statusCode: 500, statusMessage: error.message })

        for (const row of data || []) {
            const plant = Array.isArray(row.plant) ? row.plant[0] : row.plant
            if (!plant?.id) continue
            // Wie bei den Plant Points zählt nur die erste Kategorie
            const firstCategory = Array.isArray(plant.plant_categories) ? plant.plant_categories[0] : plant.plant_categories
            const category = Array.isArray(firstCategory?.categories) ? firstCategory.categories[0] : firstCategory?.categories
            entries.push({
                date: String(row.created_at).slice(0, 10),
                plantId: plant.id,
                categoryId: category?.id ?? null
            })
        }
        if (!data || data.length < PAGE_SIZE) break
    }
    return entries
}

function hasStreak(dates: string[], length: number): boolean {
    const days = [...new Set(dates)].sort().map(d => Date.parse(`${d}T00:00:00Z`) / 86400000)
    let run = 0
    for (let i = 0; i < days.length; i++) {
        run = i > 0 && days[i]! - days[i - 1]! === 1 ? run + 1 : 1
        if (run >= length) return true
    }
    return false
}

// Gibt die Keys aller Erfolge zurück, die der Nutzer aktuell erfüllt
export async function evaluateAchievements(supabase: ReturnType<typeof createServiceClient>, userId: string): Promise<AchievementKey[]> {
    const entries = await loadEntries(supabase, userId)

    const { data: categories, error } = await supabase.from('categories').select('id')
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })

    const weekStart = getStartDateForRange('7days')
    const distinctInWeek = new Set(entries.filter(e => e.date >= weekStart).map(e => e.plantId))
    const eatenCategories = new Set(entries.map(e => e.categoryId).filter(Boolean))
    const distinctTotal = new Set(entries.map(e => e.plantId))

    const reached: Record<AchievementKey, boolean> = {
        'streak-7days': hasStreak(entries.map(e => e.date), 7),
        '30plants-7days': distinctInWeek.size >= 30,
        'every-category': (categories?.length ?? 0) > 0 && categories!.every(c => eatenCategories.has(c.id)),
        '50plants': entries.length >= 50,
        '100plants': entries.length >= 100,
        '50different-plants': distinctTotal.size >= 50
    }
    return ACHIEVEMENTS.filter(a => reached[a.key]).map(a => a.key)
}
