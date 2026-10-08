import { parse } from 'yaml'

export interface KnowledgeArticle {
  slug: string
  title: string
  category: string
  sources: string[]
  paragraphs: string[]
}

// Die Markdown-Dateien werden beim Build ins Bundle eingebunden und sind dadurch offline verfügbar
const files = import.meta.glob('../content/knowledge/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

function parseArticle(path: string, raw: string): KnowledgeArticle {
  const match = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  const meta = (match ? parse(match[1] ?? '') : {}) as { title?: string, category?: string, sources?: string[] }
  const body = match?.[2] ?? raw

  return {
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
    title: meta.title ?? '',
    category: meta.category ?? 'basics',
    sources: meta.sources ?? [],
    paragraphs: body.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  }
}

// Reihenfolge ergibt sich aus dem Dateinamen (01-..., 02-...)
export const KNOWLEDGE_ARTICLES: KnowledgeArticle[] = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, raw]) => parseArticle(path, raw))
