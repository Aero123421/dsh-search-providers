import { SearchError, object, type Source, type SearchResult } from './catalog.ts'
import { httpUrl } from './http.ts'

const HOSTS = new Set(['x.com', 'twitter.com', 'mobile.twitter.com', 'fxtwitter.com', 'fixupx.com'])
export function xPostId(query: string): string | undefined {
  if (!/^https?:\/\//i.test(query)) return undefined
  const url = new URL(httpUrl(query))
  const host = url.hostname.toLowerCase().replace(/^www\./, '')
  const match = /^\/(?:[a-zA-Z0-9_]{1,15}|i\/web)\/status\/(\d{1,30})(?:\/(?:photo|video)\/\d+)?\/?$/.exec(url.pathname)
  if (!HOSTS.has(host) || !match) throw new SearchError('invalid-request', 'Expected an X post URL or search keywords')
  return match[1]
}
export function xSources(rows: unknown[], limit: number, hasMore = false): SearchResult {
  const sources: Source[] = [], seen = new Set<string>()
  let truncated = hasMore || rows.length > limit
  for (const raw of rows) {
    const row = object(raw)
    if (row.type === 'tombstone') { truncated = true; continue }
    if (row.type !== 'status' || typeof row.id !== 'string' || !/^\d{1,30}$/.test(row.id) || typeof row.text !== 'string') throw new SearchError('invalid-response', 'FxTwitter returned an invalid post')
    if (seen.has(row.id)) continue
    seen.add(row.id)
    const author = row.author === undefined || row.author === null ? {} : object(row.author)
    const handle = typeof author.screen_name === 'string' && /^[a-zA-Z0-9_]{1,15}$/.test(author.screen_name) ? author.screen_name : undefined
    const source: Source = { url: `https://x.com/${handle ?? 'i'}/status/${row.id}`, snippet: row.text.slice(0, 6000) }
    truncated ||= row.text.length > 6000
    if (typeof author.name === 'string' && author.name) source.author = author.name.slice(0, 200)
    if (handle) source.authorHandle = handle
    if (source.author || handle) source.title = [source.author, handle ? `(@${handle})` : undefined].filter(Boolean).join(' ')
    if (typeof row.created_at === 'string' && Number.isFinite(Date.parse(row.created_at))) source.publishedAt = new Date(row.created_at).toISOString()
    for (const key of ['likes', 'reposts', 'replies', 'views'] as const) {
      const value = row[key]
      if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) source[key] = value
    }
    sources.push(source)
  }
  return { sources: sources.slice(0, limit), truncated }
}
