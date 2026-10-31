import { SearchError, type Capability, type ProviderId } from './catalog.ts'
import { publicUrl } from './http.ts'

export interface SearchOptions {
  country?: string; language?: string; uiLanguage?: string; mode?: string
  includeDomains?: string[]; excludeDomains?: string[]
  publishedAfter?: string; publishedBefore?: string; updatedAfter?: string; updatedBefore?: string
  recency?: string; recencyMinutes?: number; yearMin?: number; yearMax?: number
  purpose?: string; safeSearch?: string; freshness?: string; goggles?: string[]
  acquiredAfter?: string; acquiredBefore?: string; queryTime?: string
}
export type OptionKey = keyof SearchOptions
export const MODES: Partial<Record<ProviderId, readonly string[]>> = {
  keenable: ['pro', 'realtime'], nimble: ['lite', 'standard'], parallel: ['turbo', 'fast', 'basic', 'advanced'],
  exa: ['auto', 'instant', 'fast'], perplexity: ['web', 'fast'],
}
export const OPTION_FIELDS: Record<ProviderId, readonly OptionKey[]> = {
  keenable: ['mode', 'includeDomains', 'publishedAfter', 'publishedBefore', 'acquiredAfter', 'acquiredBefore', 'queryTime'],
  nimble: ['country', 'language', 'mode', 'includeDomains', 'excludeDomains', 'publishedAfter', 'publishedBefore', 'recency'],
  tinyfish: ['country', 'language', 'includeDomains', 'excludeDomains', 'publishedAfter', 'publishedBefore', 'recencyMinutes', 'yearMin', 'yearMax', 'purpose'],
  parallel: ['country', 'mode', 'includeDomains', 'excludeDomains', 'publishedAfter'],
  exa: ['country', 'mode', 'includeDomains', 'excludeDomains', 'publishedAfter', 'publishedBefore'],
  brave: ['country', 'language', 'uiLanguage', 'safeSearch', 'freshness', 'goggles'],
  perplexity: ['country', 'language', 'mode', 'includeDomains', 'excludeDomains', 'publishedAfter', 'publishedBefore', 'updatedAfter', 'updatedBefore', 'recency'],
  fxtwitter: [],
}
const countries = new Set('AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' '))
const languages = new Set('aa ab ae af ak am an ar as av ay az ba be bg bh bi bm bn bo br bs ca ce ch co cr cs cu cv cy da de dv dz ee el en eo es et eu fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu hy hz ia id ie ig ii ik io is it iu ja jv ka kg ki kj kk kl km kn ko kr ks ku kv kw ky la lb lg li ln lo lt lu lv mg mh mi mk ml mn mr ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om or os pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu'.split(' '))
const braveCountries = new Set('AR AU AT BE BR CA CL DK FI FR DE HK IN ID IT JP KR MY MX NL NZ NO CN PL PT PH RU SA ZA ES SE CH TW TR GB US'.split(' '))
const parallelCountries = new Set('AR AU AT BE BR CA CL CN DK FI FR DE GR HK IN ID IT JP MY MX NL NZ NO PH PL PT RU SA ZA KR ES SE CH TW TR GB US'.split(' '))
const braveLanguages = new Set('ar eu bn bg ca zh-hans zh-hant hr cs da nl en en-gb et fi fr gl de gu he hi hu is it jp kn ko lv lt ms ml mr nb pl pt-br pt-pt pa ro ru sr sk sl es sv ta te th tr uk vi'.split(' '))
const braveUi = new Set('es-AR en-AU de-AT nl-BE fr-BE pt-BR en-CA fr-CA es-CL da-DK fi-FI fr-FR de-DE zh-HK en-IN en-ID it-IT ja-JP ko-KR en-MY es-MX nl-NL en-NZ no-NO zh-CN pl-PL en-PH ru-RU en-ZA es-ES sv-SE fr-CH de-CH zh-TW tr-TR en-GB en-US'.split(' '))
function invalid(message: string): never { throw new SearchError('invalid-request', message) }
export function calendarDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
}
function domains(value: unknown): string[] {
  if (!Array.isArray(value) || !value.length || value.length > 20) invalid('Use 1 to 20 plain domains')
  return value.map(domain => {
    if (typeof domain !== 'string' || domain.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)) invalid('Use plain domain names without paths, schemes or wildcards')
    return domain.toLowerCase()
  })
}
/** Empty options preserve the provider defaults used by 0.3.x. Unknown/unsupported fields fail closed. */
export function validateSearchOptions(id: ProviderId, input: unknown, capability?: Capability): SearchOptions {
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid('Search options must be an object')
  const raw = input as Record<string, unknown>, result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (!OPTION_FIELDS[id].includes(key as OptionKey)) invalid(`Unsupported ${id} search option: ${key}`)
    if (key === 'includeDomains' || key === 'excludeDomains') { result[key] = domains(value); continue }
    if (key === 'goggles') {
      if (!Array.isArray(value) || !value.length || value.length > 3 || value.some(item => typeof item !== 'string' || item.length > 2000)) invalid('Use 1 to 3 public HTTPS Goggle URLs')
      const canonical: string[] = []
      for (const item of value) {
        let href: string
        try { href = publicUrl(item) } catch { invalid('Use public HTTPS Goggle URLs') }
        if (new URL(href).protocol !== 'https:') invalid('Use public HTTPS Goggle URLs')
        canonical.push(href)
      }
      result[key] = canonical
      continue
    }
    if (key === 'yearMin' || key === 'yearMax' || key === 'recencyMinutes') {
      const maximum = key === 'recencyMinutes' ? 5_256_000 : 9999, minimum = key === 'recencyMinutes' ? 1 : 0
      if (!Number.isSafeInteger(value) || (value as number) < minimum || (value as number) > maximum) invalid(`Invalid ${key}`)
      result[key] = value; continue
    }
    if (typeof value !== 'string' || !value.length || value.length > (key === 'purpose' ? 2000 : 100)) invalid(`Invalid ${key}`)
    if (key === 'country') {
      const code = value.toUpperCase(), allowed = id === 'brave' ? braveCountries : id === 'parallel' ? parallelCountries : countries
      if (!allowed.has(code)) invalid(`Unsupported ${id} country code`)
      result[key] = code
    } else if (key === 'language') {
      // Brave names Japanese "jp"; use its documented API value, not ISO "ja".
      if (!(id === 'brave' ? braveLanguages : languages).has(value)) invalid(`Unsupported ${id} language code`)
      result[key] = value
    } else if (key === 'uiLanguage') {
      if (!braveUi.has(value)) invalid('Unsupported Brave UI language')
      result[key] = value
    } else if (key === 'mode') {
      if (!MODES[id]?.includes(value)) invalid(`Unsupported ${id} mode`)
      result[key] = value
    } else if (['publishedAfter', 'publishedBefore', 'updatedAfter', 'updatedBefore', 'acquiredAfter', 'acquiredBefore', 'queryTime'].includes(key)) {
      if (!calendarDate(value)) invalid(`${key} must be a real YYYY-MM-DD calendar date`)
      result[key] = value
    } else if (key === 'recency') {
      if (!['hour', 'day', 'week', 'month', 'year'].includes(value)) invalid('Invalid recency')
      result[key] = value
    } else if (key === 'safeSearch') {
      if (!['off', 'moderate', 'strict'].includes(value)) invalid('Invalid safe search')
      result[key] = value
    } else if (key === 'freshness') {
      const range = value.split('to')
      if (!['pd', 'pw', 'pm', 'py'].includes(value) && !(range.length === 2 && range.every(calendarDate) && range[0]! <= range[1]!)) invalid('Invalid Brave freshness range')
      result[key] = value
    } else result[key] = value
  }
  const opts = result as SearchOptions
  for (const [after, before] of [['publishedAfter', 'publishedBefore'], ['updatedAfter', 'updatedBefore'], ['acquiredAfter', 'acquiredBefore'], ['yearMin', 'yearMax']] as const) {
    if (opts[after] !== undefined && opts[before] !== undefined && opts[after]! > opts[before]!) invalid(`Invalid ${after}/${before} range`)
  }
  if ((opts.recency || opts.recencyMinutes !== undefined) && (opts.publishedAfter || opts.publishedBefore)) invalid('Relative recency and publication dates cannot be combined')
  if (opts.includeDomains && opts.excludeDomains && ['parallel', 'perplexity'].includes(id)) invalid(`${id} cannot combine include and exclude domains`)
  if (id === 'keenable' && (opts.includeDomains?.length ?? 0) > 1) invalid('Keenable supports one included site')
  if (id === 'tinyfish' && capability === 'papers' && (opts.recencyMinutes !== undefined || opts.publishedAfter || opts.publishedBefore)) invalid('TinyFish papers require publication years instead of dates/recency')
  if (id === 'tinyfish' && capability !== undefined && capability !== 'papers' && (opts.yearMin !== undefined || opts.yearMax !== undefined)) invalid('Publication years require paper search')
  if (id === 'nimble' && opts.mode === 'standard' && capability && capability !== 'web') invalid('Nimble specialized focus requires lite mode')
  if (id === 'exa' && (capability === 'people' || capability === 'companies') && (opts.publishedAfter || opts.publishedBefore)) invalid('Exa people/company do not support publication dates')
  if (id === 'exa' && capability === 'people' && opts.excludeDomains) invalid('Exa people do not support excluded domains')
  if (id === 'brave' && capability === 'images' && (opts.freshness || opts.goggles || opts.uiLanguage || opts.safeSearch === 'moderate')) invalid('Brave images support only country/language and off/strict safe search')
  if (id === 'brave' && capability && capability !== 'web' && capability !== 'news' && opts.goggles) invalid('Goggles are supported only for Brave web/news search')
  return opts
}
export function effectiveOptions(id: ProviderId, saved: SearchOptions = {}, call: SearchOptions = {}, capability?: Capability): SearchOptions {
  for (const value of [saved, call]) if (!value || typeof value !== 'object' || Array.isArray(value)) invalid('Search options must be an object')
  const merged = { ...saved, ...call }
  // Perplexity people is a separate search type; the saved web/fast choice applies only to web search.
  if (id === 'perplexity' && capability === 'people') {
    if (call.mode !== undefined) invalid('Perplexity people does not accept a web mode override')
    delete merged.mode
  }
  return validateSearchOptions(id, merged, capability ?? 'web')
}
export function searchParameters(id: ProviderId, o: SearchOptions): Record<string, unknown> {
  const out: Record<string, unknown> = {}, set = (field: string, value: unknown) => { if (value !== undefined) out[field] = value }
  if (id === 'nimble') {
    for (const [field, value] of [['country', o.country], ['locale', o.language], ['search_depth', o.mode], ['include_domains', o.includeDomains], ['exclude_domains', o.excludeDomains], ['start_date', o.publishedAfter], ['end_date', o.publishedBefore], ['time_range', o.recency]] as const) set(field, value)
  } else if (id === 'tinyfish') {
    for (const [field, value] of [['location', o.country], ['language', o.language], ['include_domains', o.includeDomains?.join(',')], ['exclude_domains', o.excludeDomains?.join(',')], ['after_date', o.publishedAfter], ['before_date', o.publishedBefore], ['recency_minutes', o.recencyMinutes], ['pub_year_min', o.yearMin], ['pub_year_max', o.yearMax], ['purpose', o.purpose]] as const) set(field, value)
  } else if (id === 'keenable') {
    for (const [field, value] of [['mode', o.mode], ['site', o.includeDomains?.[0]], ['published_after', o.publishedAfter], ['published_before', o.publishedBefore], ['acquired_after', o.acquiredAfter], ['acquired_before', o.acquiredBefore], ['query_time', o.queryTime]] as const) set(field, value)
  } else if (id === 'exa') {
    for (const [field, value] of [['userLocation', o.country], ['type', o.mode], ['includeDomains', o.includeDomains], ['excludeDomains', o.excludeDomains], ['startPublishedDate', o.publishedAfter && `${o.publishedAfter}T00:00:00.000Z`], ['endPublishedDate', o.publishedBefore && `${o.publishedBefore}T23:59:59.999Z`]] as const) set(field, value)
  } else if (id === 'perplexity') {
    const date = (v?: string) => v && `${v.slice(5, 7)}/${v.slice(8, 10)}/${v.slice(0, 4)}`
    for (const [field, value] of [['country', o.country], ['search_language_filter', o.language ? [o.language] : undefined], ['search_type', o.mode], ['search_domain_filter', o.includeDomains ?? o.excludeDomains?.map(v => `-${v}`)], ['search_after_date_filter', date(o.publishedAfter)], ['search_before_date_filter', date(o.publishedBefore)], ['last_updated_after_filter', date(o.updatedAfter)], ['last_updated_before_filter', date(o.updatedBefore)], ['search_recency_filter', o.recency]] as const) set(field, value)
  } else if (id === 'brave') {
    for (const [field, value] of [['country', o.country], ['search_lang', o.language], ['ui_lang', o.uiLanguage], ['safesearch', o.safeSearch], ['freshness', o.freshness], ['goggles', o.goggles]] as const) set(field, value)
  } else if (id === 'parallel') {
    set('mode', o.mode)
    const policy: Record<string, unknown> = {}
    if (o.includeDomains) policy.include_domains = o.includeDomains
    if (o.excludeDomains) policy.exclude_domains = o.excludeDomains
    if (o.publishedAfter) policy.after_date = o.publishedAfter
    out.advanced_settings = { ...o.country ? { location: o.country.toLowerCase() } : {}, ...Object.keys(policy).length ? { source_policy: policy } : {} }
  }
  return out
}
