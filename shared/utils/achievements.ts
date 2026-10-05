export type AchievementKey =
  | 'streak-7days'
  | '30plants-7days'
  | 'every-category'
  | '50plants'
  | '100plants'
  | '50different-plants'

export interface AchievementDefinition {
  key: AchievementKey
  title: string
  description: string
}

// Die Reihenfolge ist fest und unabhängig vom Erreichen eines Erfolgs
export const ACHIEVEMENTS: AchievementDefinition[] = [
  { key: 'streak-7days', title: '7 Tage am Stück', description: '7 Tage in Folge mindestens eine Pflanze getrackt' },
  { key: '30plants-7days', title: '30 Pflanzen in 7 Tagen', description: '30 verschiedene Pflanzen in 7 Tagen gegessen' },
  { key: 'every-category', title: 'Alle Kategorien', description: 'Eine Pflanze aus jeder Kategorie gegessen' },
  { key: '50plants', title: '50 Pflanzen', description: 'Insgesamt 50 Pflanzen getrackt' },
  { key: '100plants', title: '100 Pflanzen', description: 'Insgesamt 100 Pflanzen getrackt' },
  { key: '50different-plants', title: '50 verschiedene Pflanzen', description: '50 verschiedene Pflanzen getrackt' }
]
