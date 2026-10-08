import { serverSupabaseUser } from '#supabase/server'
import { getStartDateForRange } from '../utils/date'

// Liefert die gegessenen Pflanzen (einmalig, alphabetisch) und die prozentuale Kategorienverteilung
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })

    const range = getQuery(event).range === 'all' ? 'all' : '7days'
    const since = range === 'all' ? undefined : getStartDateForRange('7days')

    const entries = await loadEntries(createServiceClient(), user.id || user.user_metadata?.sub, since)

    // Jede Pflanze zählt nur einmal, unabhängig davon, wie oft sie gegessen wurde
    const distinct = new Map<string, TrackedEntry>()
    for (const entry of entries) {
        if (!distinct.has(entry.plantId)) distinct.set(entry.plantId, entry)
    }

    const plants = [...distinct.values()]
        .map(entry => ({ id: entry.plantId, name: entry.plantName }))
        .sort((a, b) => a.name.localeCompare(b.name, 'de'))

    // Prozentwerte basieren auf der Anzahl der Pflanzen, nicht auf den Plant Points
    const counts = new Map<string, { slug: string, name: string, count: number }>()
    let categorized = 0
    for (const entry of distinct.values()) {
        if (!entry.categorySlug) continue
        categorized++
        const current = counts.get(entry.categorySlug)
        if (current) current.count++
        else counts.set(entry.categorySlug, { slug: entry.categorySlug, name: entry.categoryName ?? entry.categorySlug, count: 1 })
    }

    const categories = [...counts.values()]
        .map(category => ({ ...category, percent: (category.count / categorized) * 100 }))
        .sort((a, b) => b.percent - a.percent || a.name.localeCompare(b.name, 'de'))

    return { plants, categories }
})
