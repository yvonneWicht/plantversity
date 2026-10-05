import badge7days from '~/assets/images/badge-7days.svg'
import badge30plants from '~/assets/images/badge-30plants.svg'
import badgeEveryCategory from '~/assets/images/badge-every-category.svg'
import badge50plants from '~/assets/images/badge-50plants.svg'
import badge100plants from '~/assets/images/badge-100plants.svg'
import badge50different from '~/assets/images/badge-50different-plants.svg'
import badgePlaceholder from '~/assets/images/badge-placeholder.svg'

const BADGES: Record<AchievementKey, string> = {
  'streak-7days': badge7days,
  '30plants-7days': badge30plants,
  'every-category': badgeEveryCategory,
  '50plants': badge50plants,
  '100plants': badge100plants,
  '50different-plants': badge50different
}

export function getBadgeImage(key: AchievementKey, achieved: boolean): string {
  return achieved ? BADGES[key] : badgePlaceholder
}

export function useAchievements() {
  // Warteschlange der noch nicht angezeigten, neu erreichten Erfolge
  const pending = useState<AchievementKey[]>('achievements-pending', () => [])

  // Prüft nach dem Tracken, ob neue Erfolge erreicht wurden
  async function checkAchievements() {
    try {
      const newlyReached = await $fetch('/api/achievements/check', { method: 'POST' })
      pending.value.push(...newlyReached)
    } catch (error) {
      console.error('Fehler bei der Erfolgsprüfung:', error)
    }
  }

  function dismiss() {
    pending.value.shift()
  }

  return { pending, checkAchievements, dismiss }
}
