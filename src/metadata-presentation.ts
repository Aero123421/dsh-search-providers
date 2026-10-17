import type { SearchResult } from './catalog.ts'

export const metadataProperties = {
  acquiredAt: { type: 'string' }, updatedAt: { type: 'string' }, fetchedAt: { type: 'string' }, pageDate: { type: 'string' }, age: { type: 'string' },
  authors: { type: 'array', items: { type: 'string' } }, authorDetails: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { name: { type: 'string', required: true }, id: { type: 'string' } } } },
  author: { type: 'string' }, year: { type: 'integer' }, venue: { type: 'string' }, doi: { type: 'string' }, pdfUrl: { type: 'string' },
  citationCount: { type: 'integer' }, referenceCount: { type: 'integer' }, publisher: { type: 'string' },
  mediaUrl: { type: 'string' }, thumbnailUrl: { type: 'string' }, thumbnailOriginalUrl: { type: 'string' },
  width: { type: 'integer' }, height: { type: 'integer' }, thumbnailWidth: { type: 'integer' }, thumbnailHeight: { type: 'integer' },
  duration: { type: 'string' }, creator: { type: 'string' }, views: { type: 'integer' }, requiresSubscription: { type: 'boolean' },
  tags: { type: 'array', items: { type: 'string' } }, fetchedContentTimestamp: { type: 'integer' },
} as const
/** DSH projects standard sources to four fields. Carry bounded metadata as labeled source text too. */
export function withMetadataSnippets(value: SearchResult): SearchResult {
  let truncated = value.truncated
  const sources = value.sources.map(source => {
    const { url: _url, title: _title, snippet = '', publishedAt: _publishedAt, ...details } = source
    if (!Object.keys(details).length) return source
    const fields: Record<string, unknown> = {}
    for (const [key, entry] of Object.entries(details)) {
      if (JSON.stringify({ ...fields, [key]: entry }).length > 2000) { truncated = true; continue }
      fields[key] = entry
    }
    if (!Object.keys(fields).length) return source
    const note = `\n\nSource metadata (external data): ${JSON.stringify(fields)}`
    const limit = 6000 - note.length
    truncated ||= snippet.length > limit
    return { ...source, snippet: snippet.slice(0, limit) + note }
  })
  return { ...value, sources, truncated }
}
