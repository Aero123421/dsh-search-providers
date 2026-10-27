import type { Capability, ProviderId } from './catalog.ts'
import { publicUrl } from './http.ts'

/** Validated optional source fields, not an upstream payload or an instruction channel. */
export interface SourceMetadata {
  publishedAt?: string
  updatedAt?: string
  fetchedAt?: string
  /** Keenable's acquisition/index time, distinct from publication or live retrieval. */
  acquiredAt?: string
  /** Brave's page date can mean publication OR modification; it is neither asserted here. */
  pageDate?: string
  /** Provider-supplied relative age label, never converted into an absolute date. */
  age?: string
  /** Brave does not specify the unit of fetched_content_timestamp in its reference. */
  fetchedContentTimestamp?: number
  author?: string
  authors?: string[]
  authorDetails?: { name: string; id?: string }[]
  year?: number
  venue?: string
  doi?: string
  pdfUrl?: string
  citationCount?: number
  referenceCount?: number
  publisher?: string
  mediaUrl?: string
  thumbnailUrl?: string
  thumbnailOriginalUrl?: string
  width?: number
  height?: number
  thumbnailWidth?: number
  thumbnailHeight?: number
  /** Brave's time string, retained without guessing its format or unit. */
  duration?: string
  creator?: string
  views?: number
  requiresSubscription?: boolean
  tags?: string[]
}

// Bounds apply before parsing or iteration. The aggregate cap includes JSON keys/escaping.
const MAX_JSON_CHARS = 16_384
const MAX_AUTHORS = 20
const MAX_ENTITIES = 8
const MAX_TAGS = 10
const MAX_URL = 2048
const MAX_DIMENSION = 100_000

/**
 * Extract only allowlisted, bounded metadata. Missing/null fields are optional;
 * rejected or shortened recognized values set truncated, unknown fields do not.
 * Only fixed schema paths are visited: no recursive walk, raw payload, quotes,
 * subpages, biographies, abstract, or provider-inferred default values are copied.
 */
export function sourceMetadata(row: Record<string, unknown>, provider: ProviderId, capability?: Capability): { metadata: SourceMetadata; truncated: boolean } {
  const metadata: SourceMetadata = {}
  let truncated = false, size = 2
  const present = (value: unknown) => value !== undefined && value !== null
  function record(value: unknown): Record<string, unknown> | undefined {
    if (!present(value)) return undefined
    if (typeof value === 'object' && !Array.isArray(value)) {
      try {
        const prototype = Object.getPrototypeOf(value)
        if (prototype === Object.prototype || prototype === null) return value as Record<string, unknown>
      } catch { /* Reject malformed objects without invoking their conversion methods. */ }
    }
    truncated = true
    return undefined
  }
  function field(value: Record<string, unknown> | undefined, key: string): unknown {
    if (!value) return undefined
    try {
      const descriptor = Object.getOwnPropertyDescriptor(value, key)
      if (!descriptor) return undefined
      if ('value' in descriptor) return descriptor.value
    } catch { /* JSON never has accessors/proxies; ignore them if called directly. */ }
    truncated = true
    return undefined
  }
  function put<K extends keyof SourceMetadata>(key: K, value: SourceMetadata[K] | undefined): void {
    if (value === undefined || metadata[key] !== undefined) return
    const added = JSON.stringify({ [key]: value }).length - 1
    if (size + added > MAX_JSON_CHARS) { truncated = true; return }
    metadata[key] = value
    size += added
  }
  function text(value: unknown, max = 1000): string | undefined {
    if (!present(value)) return undefined
    if (typeof value !== 'string') { truncated = true; return undefined }
    if (value.length > max) truncated = true
    const result = value.slice(0, max).trim()
    if (!result || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(result)) { truncated = true; return undefined }
    return result
  }
  function integer(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number | undefined {
    if (!present(value)) return undefined
    if (typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max) return value
    truncated = true
    return undefined
  }
  function boolean(value: unknown): boolean | undefined {
    if (!present(value)) return undefined
    if (typeof value === 'boolean') return value
    truncated = true
    return undefined
  }
  function url(value: unknown): string | undefined {
    if (!present(value)) return undefined
    if (typeof value === 'string' && value.length <= MAX_URL && !/[\s\u0000-\u001f\u007f]/u.test(value)) {
      try {
        const href = publicUrl(value)
        if (href.length <= MAX_URL) return href
      } catch { /* Invalid or non-public optional links do not fail the source. */ }
    }
    truncated = true
    return undefined
  }
  function date(value: unknown): string | undefined {
    if (!present(value)) return undefined
    // Keep date-only precision and supplied offsets. Do not parse relative/local dates.
    if (typeof value === 'string' && value.length <= 64) {
      const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2}))?$/u.exec(value)
      if (match) {
        const year = Number(match[1]), month = Number(match[2]), day = Number(match[3])
        const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
        const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 0
        if (year >= 1 && day >= 1 && day <= days && (!match[4] || (Number(match[4]) <= 23 && Number(match[5]) <= 59 && Number(match[6]) <= 59)) && Number.isFinite(Date.parse(value))) return value
      }
    }
    truncated = true
    return undefined
  }
  function unixSeconds(value: unknown): string | undefined {
    const seconds = integer(value, -62_135_596_800, 253_402_300_799)
    return seconds === undefined ? undefined : new Date(seconds * 1000).toISOString()
  }
  function doi(value: unknown): string | undefined {
    if (!present(value)) return undefined
    if (typeof value === 'string' && value.length <= 512) {
      const bare = value.replace(/^https?:\/\/(?:dx\.)?doi\.org\//iu, '')
      if (bare.length <= 256 && /^10\.\d{4,9}\/[^\s<>"\u0000-\u001f\u007f]+$/u.test(bare)) return bare
    }
    truncated = true
    return undefined
  }
  function authors(value: unknown): void {
    if (!present(value)) return
    if (!Array.isArray(value)) { truncated = true; return }
    if (value.length > MAX_AUTHORS) truncated = true
    const names: string[] = [], details: { name: string; id?: string }[] = []
    for (let index = 0; index < Math.min(value.length, MAX_AUTHORS); index++) {
      const item: unknown = field(value as unknown as Record<string, unknown>, String(index))
      if (typeof item === 'string') {
        const name = text(item, 200)
        if (name) names.push(name)
      } else {
        const author = record(item), name = text(field(author, 'name'), 200)
        if (!name) { truncated = true; continue }
        const id = text(field(author, 'id'), 256)
        names.push(name)
        details.push({ name, ...id === undefined ? {} : { id } })
      }
    }
    if (names.length && metadata.authors === undefined) {
      put('authors', names)
      // Never attach IDs from a fallback list to authors selected from an entity.
      if (metadata.authors === names && details.length) put('authorDetails', details)
    }
  }
  function paper(value: Record<string, unknown> | undefined): void {
    authors(field(value, 'authors'))
    put('year', integer(field(value, 'year'), 0, 9999))
    put('venue', text(field(value, 'venue')))
    put('doi', doi(field(value, 'doi')))
  }
  const root = record(row)
  if (!root) return { metadata, truncated }

  // Nimble's date is a search timestamp, not a publication timestamp.
  if (provider !== 'nimble' && provider !== 'fxtwitter') {
    if (provider === 'keenable') {
      // Search returns ISO strings; Fetch documents integer Unix seconds.
      const published = field(root, 'published_at')
      put('publishedAt', typeof published === 'number' ? unixSeconds(published) : date(published))
      put('acquiredAt', date(field(root, 'acquired_at')))
    }
    for (const key of ['publishedDate', 'publish_date', 'date']) put('publishedAt', date(field(root, key)))
    if (provider !== 'keenable') put('publishedAt', date(field(root, 'published_at')))
  }
  if (provider === 'perplexity') put('updatedAt', date(field(root, 'last_updated')))
  if (provider === 'tinyfish') put('publishedAt', date(field(root, 'published_date')))
  if (provider === 'keenable' || provider === 'exa' || provider === 'tinyfish') put('author', text(field(root, 'author'), 200))

  if (provider === 'exa') {
    // Do not promote a person's/company's lifetime citation count to this paper.
    const entities = field(root, 'entities')
    if (present(entities)) {
      if (!Array.isArray(entities)) truncated = true
      else {
        if (entities.length > MAX_ENTITIES) truncated = true
        let selected = false
        for (let index = 0; index < Math.min(entities.length, MAX_ENTITIES); index++) {
          const entity = record(field(entities as unknown as Record<string, unknown>, String(index)))
          const type = field(entity, 'type')
          if (!entity || typeof type !== 'string') { truncated = true; continue }
          if (type !== 'publication') continue
          if (selected) { truncated = true; continue }
          const properties = record(field(entity, 'properties'))
          if (!properties) { truncated = true; continue }
          selected = true
          paper(properties)
          put('publishedAt', date(field(properties, 'date')))
          put('citationCount', integer(field(properties, 'citationCount')))
          put('referenceCount', integer(field(properties, 'referenceCount')))
        }
      }
    }
  }
  if (capability === 'papers') {
    paper(root)
    if (provider === 'tinyfish') {
      put('citationCount', integer(field(root, 'cited_by_count')))
      put('pdfUrl', url(field(root, 'pdf_url')))
    }
  }
  if (provider === 'tinyfish') put('publisher', text(field(root, 'publisher')))

  if (provider === 'brave') {
    put('pageDate', date(field(root, 'page_age')))
    put('fetchedAt', date(field(root, 'page_fetched')))
    put('fetchedContentTimestamp', integer(field(root, 'fetched_content_timestamp')))
    put('age', text(field(root, 'age'), 100))
    const thumbnail = record(field(root, 'thumbnail'))
    put('thumbnailUrl', url(field(thumbnail, 'src')))
    put('thumbnailOriginalUrl', url(field(thumbnail, 'original')))
    put('thumbnailWidth', integer(field(thumbnail, 'width'), 1, MAX_DIMENSION))
    put('thumbnailHeight', integer(field(thumbnail, 'height'), 1, MAX_DIMENSION))
    if (capability === 'images') {
      const properties = record(field(root, 'properties'))
      put('mediaUrl', url(field(properties, 'url')))
      put('width', integer(field(properties, 'width'), 1, MAX_DIMENSION))
      put('height', integer(field(properties, 'height'), 1, MAX_DIMENSION))
    }
    const video = record(field(root, 'video'))
    put('duration', text(field(video, 'duration'), 100))
    put('creator', text(field(video, 'creator'), 200))
    put('publisher', text(field(video, 'publisher')))
    put('views', integer(field(video, 'views')))
    put('requiresSubscription', boolean(field(video, 'requires_subscription')))
    const tags = field(video, 'tags')
    if (present(tags)) {
      if (!Array.isArray(tags)) truncated = true
      else {
        if (tags.length > MAX_TAGS) truncated = true
        const result: string[] = []
        for (let index = 0; index < Math.min(tags.length, MAX_TAGS); index++) {
          const tag = text(field(tags as unknown as Record<string, unknown>, String(index)), 100)
          if (tag) result.push(tag)
          else truncated = true
        }
        if (result.length) put('tags', result)
      }
    }
  }
  return { metadata, truncated }
}
