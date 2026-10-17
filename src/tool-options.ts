import { MODES, OPTION_FIELDS, type OptionKey } from './search-options.ts'
import type { ProviderId } from './catalog.ts'

const date = (description: string) => ({ type: 'string' as const, description: `${description} Real YYYY-MM-DD calendar date. Interpretation and inclusivity are provider-defined; Exa uses UTC day start/end.` })
const fields = {
  country: { type: 'string', description: 'Supported ISO country code, e.g. JP. Omit to retain saved/API default.' },
  language: { type: 'string', description: 'Result language code, e.g. ja; Brave uses jp for Japanese and zh-hans/zh-hant for Chinese. Not a translation request.' },
  uiLanguage: { type: 'string', description: 'Brave response display locale, e.g. ja-JP; distinct from result language.' },
  mode: { type: 'string', description: 'Provider-specific mode. Omit to retain saved/legacy default. Modes can change price/latency; never automatically upgraded.' },
  includeDomains: { type: 'array', items: { type: 'string' }, description: '1–20 plain domains only, no paths/wildcards. Keenable: one site. Parallel/Perplexity: cannot combine with excludeDomains.' },
  excludeDomains: { type: 'array', items: { type: 'string' }, description: '1–20 plain domains. Exa people does not support this option.' },
  publishedAfter: date('Publication lower bound. Cannot combine with relative recency. TinyFish papers use yearMin/yearMax; Exa people/company disallow publication dates.'),
  publishedBefore: date('Publication upper bound. Must not precede lower bound.'),
  updatedAfter: date('Last-updated lower bound; not publication date.'), updatedBefore: date('Last-updated upper bound.'),
  acquiredAfter: date('Keenable acquired/indexed lower bound; not publication date.'), acquiredBefore: date('Keenable acquired/indexed upper bound.'),
  queryTime: date('Keenable index point-in-time; resolves to UTC midnight, not day end.'),
  recency: { type: 'string', enum: ['hour', 'day', 'week', 'month', 'year'], description: 'Relative publication recency. Cannot combine with absolute publication dates.' },
  recencyMinutes: { type: 'integer', description: 'TinyFish relative freshness, 1–5256000 minutes. Cannot combine with publication dates or paper search.' },
  yearMin: { type: 'integer', description: 'TinyFish papers only: inclusive publication year minimum, 0–9999.' },
  yearMax: { type: 'integer', description: 'TinyFish papers only: inclusive publication year maximum, 0–9999, at least yearMin.' },
  purpose: { type: 'string', description: 'TinyFish search intent, at most 2000 characters.' },
  safeSearch: { type: 'string', enum: ['off', 'moderate', 'strict'], description: 'Brave filtering. Images accept only off/strict.' },
  freshness: { type: 'string', description: 'Brave pd/pw/pm/py or YYYY-MM-DDtoYYYY-MM-DD. Page age can reflect publication OR modification. Not supported for images.' },
  goggles: { type: 'array', items: { type: 'string' }, description: 'Brave web/news only: 1–3 public HTTPS Goggle URLs, each at most 2000 characters. Sent to Brave, not fetched by this plugin.' },
} as const
export function toolOptions(provider: ProviderId) {
  const properties = Object.fromEntries(OPTION_FIELDS[provider].map(key => [key, key === 'mode' ? { ...fields[key], enum: MODES[provider]! } : fields[key as OptionKey]]))
  return { type: 'object' as const, additionalProperties: false as const, properties,
    description: 'Optional per-call overrides of saved provider options; omitted fields retain saved values. Unsupported combinations fail before sending. Any saved/call option disables cross-provider 429 fallback. Not allowed with next_page.' }
}
