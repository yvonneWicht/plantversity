// Farben je Kategorie (Slug), feste Zuordnung damit eine Kategorie immer dieselbe Farbe hat
export const CATEGORY_COLORS: Record<string, string> = {
  'vegetables': '#0000ff',
  'fruit': '#f15a24',
  'grains-pseudograins': '#8cc63f',
  'legumes': '#fbb03b',
  'nuts': '#ff00ff',
  'seeds': '#c69c6d',
  'spices-extras': '#006837'
}
export const FALLBACK_COLOR = '#7c8a6d'

export const CATEGORY_LABELS: Record<string, string> = {
  'vegetables': 'Gemüse',
  'fruit': 'Obst',
  'grains-pseudograins': 'Getreide & Pseudogetreide',
  'legumes': 'Hülsenfrüchte',
  'nuts': 'Nüsse',
  'seeds': 'Samen',
  'spices-extras': 'Kräuter & Gewürze',
  'basics': 'Grundlagen'
}
