import React, { useEffect, useId, useState, useSyncExternalStore } from 'react'
import type { ComponentType } from 'react'
import { Button, Input, Modal, Switch, StateDot, IconSearchOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import { UpdateController } from './update-controller.ts'
import { SearchController, type Connection } from './controller.ts'
import { providerRoute, type ProviderId } from './catalog.ts'
import type { ProviderView, Snapshot } from './broker.ts'
import type { SettingsProblem } from './catalog.ts'
import { en, ja, zh, type CopyKey } from './locales.ts'
import { MODES, OPTION_FIELDS, validateSearchOptions, type OptionKey, type SearchOptions } from './search-options.ts'
import css from './styles.css'

const COPY_NS = 'dsh.searchProviders'
type Translate = (key: CopyKey) => string
interface Locale { subscribe(listener: () => void): () => void; getSnapshot(): { revision: number }; bind(namespace: string): Translate; register(namespace: string, dictionaries: object): () => void }
interface ClientContext {
  connection: Connection; locale: Locale
  slots: { inject(name: string, callback: () => void): void; register(entry: object, component: ComponentType<PageProps>): void }
  effect(callback: () => () => void, label?: string): void
  on(event: string, callback: () => void): void
  remote?: { $on(event: string, callback: () => void): () => void }
}
interface PageProps { controller: SearchController; locale: Locale; updates: UpdateController }
export const inject = ['slots', 'locale', 'connection', 'remote']
function useCopy(locale: Locale): Translate {
  useSyncExternalStore(listener => locale.subscribe(listener), () => locale.getSnapshot().revision)
  return locale.bind(COPY_NS)
}
function problemCopy(problem: SettingsProblem): CopyKey {
  if (problem.reason === 'invalid-search') return 'ignoredSearch'
  if (problem.reason === 'invalid-state') return 'ignoredState'
  if (!problem.id) return 'ignoredSection'
  return problem.scope === 'tools' ? 'ignoredTool' : 'ignoredProvider'
}
function problemTitle(problem: SettingsProblem, entries: ProviderView[]): string {
  const known = entries.find(row => row.id === problem.id)?.label
  if (known && (problem.reason === 'invalid-search' || problem.reason === 'invalid-state')) return known
  if (!problem.id) return ''
  return problem.id.length > 80 ? `${problem.id.slice(0, 79)}…` : problem.id
}
function errorKey(error: unknown): CopyKey {
  const message = error instanceof Error ? error.message : ''
  if (message.endsWith('/settings-changed')) return 'conflict'
  if (message.endsWith('/missing-key')) return 'missingKey'
  if (message.endsWith('/provider-disabled')) return 'disabled'
  return 'saveFailed'
}
function KeyDialog({ entry, controller, t, onClose }: { entry: ProviderView; controller: SearchController; t: Translate; onClose(): void }) {
  const [key, setKey] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState<CopyKey>()
  const id = useId()
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(undefined)
    const value = key
    try { await controller.call('save-key', { provider: entry.id, key: value }); setKey(''); await controller.refresh(); onClose() }
    catch (error) { setError(errorKey(error)) } finally { setBusy(false) }
  }
  async function remove() {
    setBusy(true); setKey(''); setError(undefined)
    try { await controller.call('delete-key', { provider: entry.id }); await controller.refresh(); onClose() }
    catch (error) { setError(errorKey(error)) } finally { setBusy(false) }
  }
  return <Modal open title={`${entry.label} · ${t('key')}`} closeLabel={t('close')} onClose={onClose} className="dsh-search-dialog">
    <form onSubmit={event => { void save(event) }} className="dsh-search-key-form">
      <label htmlFor={id}>{t('key')}</label>
      <Input id={id} type="password" autoComplete="off" value={key} onChange={event => setKey(event.target.value)} disabled={busy || !entry.writable} data-modal-autofocus />
      <p className="dsh-search-muted">{t('keyHint')}</p>
      {error && <p role="alert" className="dsh-search-error">{t(error)}</p>}
      <div className="dsh-search-actions">
        <Button type="submit" variant="primary" disabled={busy || !key.trim() || !entry.writable}>{t('save')}</Button>
        {entry.source === 'saved' && <Button variant="outline" disabled={busy || !entry.writable} onClick={() => { void remove() }}>{t('deleteKey')}</Button>}
      </div>
    </form>
  </Modal>
}
function FeaturesDialog({ entry, snapshot, controller, t, onClose }: { entry: ProviderView; snapshot: Snapshot; controller: SearchController; t: Translate; onClose(): void }) {
  const [search, setSearch] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState<CopyKey>()
  const features = entry.capabilities.filter(id => `${t(id)} ${t(`${id}Hint`)}`.toLowerCase().includes(search.toLowerCase()))
  async function change(capability: string, enabled: boolean) {
    setBusy(true); setError(undefined)
    try { await controller.call('tool', { provider: entry.id, capability, enabled, revision: snapshot.revision }); await controller.refresh() }
    catch (error) { setError(errorKey(error)); await controller.refresh() } finally { setBusy(false) }
  }
  return <Modal open title={`${entry.label} · ${t('selectTools')}`} closeLabel={t('close')} onClose={onClose} className="dsh-search-dialog">
    <Input aria-label={t('searchFeatures')} placeholder={t('searchFeatures')} value={search} onChange={event => setSearch(event.target.value)} data-modal-autofocus />
    {error && <p role="alert" className="dsh-search-error">{t(error)}</p>}
    <div className="dsh-search-feature-list">
      {features.map(id => {
        const selected = snapshot.tools[id], active = selected?.enabled === true && selected.provider === entry.id
        const other = selected?.enabled && !active ? snapshot.entries.find(row => row.id === selected.provider) : undefined
        return <div key={id} className="dsh-search-feature">
          <div><span>{t(id)}</span><p className="dsh-search-muted">{t(`${id}Hint`)}</p>{other && <p className="dsh-search-muted">{t('providedBy')}: {other.label}</p>}</div>
          <Switch label={`${t('feature')}: ${t(id)}`} checked={active} disabled={busy || !entry.enabled} onChange={value => { void change(id, value) }} />
        </div>
      })}
      {features.length === 0 && <p className="dsh-search-muted">{t('noFeatures')}</p>}
    </div>
  </Modal>
}
const listFields: readonly OptionKey[] = ['includeDomains', 'excludeDomains', 'goggles']
const numericFields: readonly OptionKey[] = ['recencyMinutes', 'yearMin', 'yearMax']
const dateFields: readonly OptionKey[] = ['publishedAfter', 'publishedBefore', 'updatedAfter', 'updatedBefore', 'acquiredAfter', 'acquiredBefore', 'queryTime']
function optionDraft(options: SearchOptions = {}): Partial<Record<OptionKey, string>> {
  return Object.fromEntries(Object.entries(options).map(([key, value]) => [key, Array.isArray(value) ? value.join('\n') : String(value)]))
}
function SearchOptionsDialog({ entry, snapshot, controller, t, onClose }: { entry: ProviderView; snapshot: Snapshot; controller: SearchController; t: Translate; onClose(): void }) {
  const [draft, setDraft] = useState(() => optionDraft(entry.search)), [revision, setRevision] = useState(snapshot.revision)
  const [busy, setBusy] = useState(false), [error, setError] = useState<CopyKey>(), [refreshFailed, setRefreshFailed] = useState(false)
  const id = useId(), formId = `${id}-form`, fields = OPTION_FIELDS[entry.id]
  async function refreshRevision() {
    await controller.refresh()
    const current = controller.getSnapshot()
    setRefreshFailed(!!current.error || !current.snapshot)
    if (current.snapshot && !current.error) setRevision(current.snapshot.revision)
  }
  async function save(reset = false) {
    if (busy || refreshFailed) return
    let options: SearchOptions
    try {
      const raw = Object.fromEntries(fields.flatMap(field => {
        const value = draft[field]?.trim()
        if (!value) return []
        return [[field, listFields.includes(field) ? value.split(/[,\n]/).map(item => item.trim()).filter(Boolean) : numericFields.includes(field) ? Number(value) : value]]
      }))
      options = validateSearchOptions(entry.id, reset ? {} : raw)
    } catch { setError('invalidOptions'); return }
    setBusy(true); setError(undefined)
    try { await controller.call('search-options', { provider: entry.id, options, revision }); await controller.refresh(); onClose() }
    catch (failure) {
      const key = errorKey(failure)
      setError(failure instanceof Error && failure.message.endsWith('/invalid-request') ? 'invalidOptions' : key === 'saveFailed' ? 'optionsSaveFailed' : key)
      await refreshRevision()
    } finally { setBusy(false) }
  }
  function hint(field: OptionKey): CopyKey {
    if (field === 'language') return entry.id === 'brave' ? 'optionBraveLanguageHint' : 'optionLanguageHint'
    if (dateFields.includes(field)) return 'optionDateHint'
    if (field === 'includeDomains' || field === 'excludeDomains') return entry.id === 'keenable' ? 'optionSingleDomainHint' : 'optionDomainsHint'
    if (field === 'yearMin' || field === 'yearMax') return 'optionYearHint'
    return `optionHint_${field}` as CopyKey
  }
  return <Modal open title={`${entry.label} · ${t('searchSettings')}`} closeLabel={t('close')} onClose={() => { if (!busy) onClose() }} className="dsh-search-dialog dsh-search-options-dialog" contentClassName="dsh-search-dialog-content" footer={<div className="dsh-search-dialog-footer">
    {error && <p role="alert" className="dsh-search-error">{t(error)}</p>}
    {error === 'conflict' && <p className="dsh-search-muted">{t('optionsConflictNote')}</p>}
    {refreshFailed && <p role="alert" className="dsh-search-error">{t('optionsRefreshFailed')} <Button type="button" size="sm" disabled={busy} onClick={() => { setBusy(true); void refreshRevision().finally(() => setBusy(false)) }}>{t('retry')}</Button></p>}
    {busy && <p role="status" className="dsh-search-muted">{t('saving')}</p>}
    <div className="dsh-search-actions">
      <Button type="submit" form={formId} variant="primary" disabled={busy || refreshFailed}>{t('save')}</Button>
      <Button type="button" variant="outline" disabled={busy || refreshFailed} onClick={() => { void save(true) }}>{t('resetSearchOptions')}</Button>
      <Button type="button" variant="outline" disabled={busy} onClick={onClose}>{t('cancel')}</Button>
    </div>
  </div>}>
    <form id={formId} className="dsh-search-options-form" noValidate aria-busy={busy} onSubmit={event => { event.preventDefault(); void save() }}>
      <p className="dsh-search-muted">{t('optionsDefaultNote')}</p>
      <p className="dsh-search-muted">{t('optionsBillingNote')}</p>
      {fields.map((field, index) => {
        const fieldId = `${id}-${field}`, choices = field === 'mode' ? MODES[entry.id] : field === 'recency' ? ['hour', 'day', 'week', 'month', 'year'] : field === 'safeSearch' ? ['off', 'moderate', 'strict'] : undefined
        const props = { id: fieldId, value: draft[field] ?? '', disabled: busy, 'aria-describedby': `${fieldId}-hint`, 'data-modal-autofocus': index === 0 ? true : undefined, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setDraft(current => ({ ...current, [field]: event.target.value })) }
        return <div className="dsh-search-option" key={field}>
          <label htmlFor={fieldId}>{t(`option_${field}`)}</label>
          {choices ? <select {...props} className="dsh-search-select"><option value="">{t('optionUnspecified')}</option>{choices.map(value => <option key={value} value={value}>{field === 'mode' ? value : t(`optionValue_${value}` as CopyKey)}</option>)}</select>
            : listFields.includes(field) || field === 'purpose' ? <textarea {...props} className="dsh-search-textarea" rows={field === 'purpose' ? 2 : 3} />
              : <Input {...props} type={numericFields.includes(field) ? 'number' : 'text'} min={field === 'recencyMinutes' ? 1 : 0} max={field === 'recencyMinutes' ? 5256000 : 9999} step={numericFields.includes(field) ? 1 : undefined} placeholder={dateFields.includes(field) ? 'YYYY-MM-DD' : field === 'country' ? 'JP' : field === 'language' ? entry.id === 'brave' ? 'jp' : 'ja' : field === 'uiLanguage' ? 'ja-JP' : undefined} />}
          <p id={`${fieldId}-hint`} className="dsh-search-muted">{t(hint(field))}</p>
        </div>
      })}
    </form>
  </Modal>
}
function UpdateRow({ controller, t }: { controller: UpdateController; t: Translate }) {
  const view = useSyncExternalStore(controller.subscribe, controller.getSnapshot)
  useEffect(() => { void controller.status() }, [controller])
  const busy = !view.profileKey || view.status === 'checking' || view.status === 'installing'
  return <div className="dsh-search-update">
    <p>{t('updateRunning')}: {view.running}{view.installed && view.installed !== view.running ? ` · ${t('updateInstalled')}: ${view.installed}` : ''}</p>
    <p role="status">{t(`update_${view.status}`)}{view.reason && <span> · {t('updateReason')}: {t((`updateReason_${view.reason}` in en ? `updateReason_${view.reason}` : 'updateReason_other') as CopyKey)}</span>}{view.requirements && <span> · {Object.entries(view.requirements).map(([field, range]) => `${field} ${range}`).join(' · ')}</span>}{view.stage && <span> · {t('updateStage')}: {view.stage}</span>}</p>
    {view.checkedAt && <p className="dsh-search-muted">{t('updateChecked')}: {new Date(view.checkedAt).toLocaleString()}</p>}
    {view.candidate && view.status === 'available' && <><p>{view.running} → {view.candidate.version} · DSH {view.candidate.runtime}</p><p className="dsh-search-update-notes">{view.candidate.notes}</p><p className="dsh-search-muted">{t('updatePin')}</p></>}
    <div className="dsh-search-actions">
      <Button variant="outline" size="sm" disabled={busy || view.status === 'unavailable' || view.status === 'unknown' || view.status === 'restart-required'} onClick={() => { void controller.check() }}>{t('updateCheck')}</Button>
      {view.status === 'available' && <Button variant="primary" size="sm" onClick={() => { void controller.install() }}>{t('updateInstall')}</Button>}
      {view.status === 'unknown' && <Button variant="outline" size="sm" onClick={() => { void controller.status() }}>{t('updateReconcile')}</Button>}
      <a href="https://github.com/Aero123421/dsh-search-providers/releases" target="_blank" rel="noreferrer">{t('updateReleases')}</a>
    </div>
  </div>
}
export function SearchSettings({ controller, locale, updates }: PageProps) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot), t = useCopy(locale)
  const [dialog, setDialog] = useState<{ kind: 'key' | 'features' | 'search'; provider: ProviderId }>(), [busy, setBusy] = useState(false), [error, setError] = useState<CopyKey>()
  useEffect(() => { void controller.load() }, [controller])
  const snapshot = state.snapshot, entry = snapshot?.entries.find(row => row.id === dialog?.provider)
  async function save(method: string, payload: object) {
    if (!snapshot) return
    setBusy(true); setError(undefined)
    try { await controller.call(method, { ...payload, revision: snapshot.revision, searchRevision: snapshot.searchRevision }); await controller.refresh() }
    catch (error) { setError(errorKey(error)); await controller.refresh() } finally { setBusy(false) }
  }
  const defaultDisabled = snapshot?.entries.some(row => snapshot.searchProvider === providerRoute(row.id) && !row.enabled)
  return <section className="dsh-search-settings">
    <h2>{t('title')}</h2>
    <p className="dsh-search-note">{t('pricingNote')} <a href="https://api-dashboard.search.brave.com/documentation/resources/help-feedback" target="_blank" rel="noreferrer">{t('bravePricing')}</a></p>
    <p className="dsh-search-note">{t('fallbackNote')}</p>
    <p className="dsh-search-note">{t('lifecycleNote')}</p>
    <UpdateRow controller={updates} t={t} />
    {state.error && <p role="alert" className="dsh-search-error">{t('loadFailed')} <Button size="sm" onClick={() => { void controller.refresh() }}>{t('retry')}</Button></p>}
    {error && <p role="alert" className="dsh-search-error">{t(error)}</p>}
    {state.status === 'loading' && !snapshot && <div className="dsh-search-loading"><StateDot state="ongoing" size={20} /></div>}
    {defaultDisabled && <p role="alert" className="dsh-search-error">{t('defaultDisabled')}</p>}
    {snapshot && <div className="dsh-search-providers">
      {snapshot.problems.map(problem => <article key={`${problem.scope}:${problem.reason}:${problem.id}`} className="dsh-search-provider">
        <div className="dsh-search-provider-head"><span className="dsh-search-name">{problemTitle(problem, snapshot.entries) || t(problemCopy(problem))}</span>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => { void save('remove-ignored', { scope: problem.scope, id: problem.id, reason: problem.reason }) }}>{t('removeIgnored')}</Button></div>
        {problemTitle(problem, snapshot.entries) && <p className="dsh-search-muted">{t(problemCopy(problem))}</p>}
      </article>)}
      <article className="dsh-search-provider">
        <div className="dsh-search-provider-head"><span className="dsh-search-name">{t('native')}</span>{!snapshot.searchProvider.startsWith('dsh-search-providers-') ? <span className="dsh-search-tag">{t('default')}</span>
          : <Button variant="outline" size="sm" disabled={busy} onClick={() => { void save('default', { provider: 'native' }) }}>{t('setDefault')}</Button>}</div>
      </article>
      {snapshot.entries.map(row => <article key={row.id} className="dsh-search-provider">
        <div className="dsh-search-provider-head"><div className="dsh-search-identity"><span className="dsh-search-name">{row.label}</span>{snapshot.searchProvider === providerRoute(row.id) && <span className="dsh-search-tag">{t('default')}</span>}</div>
          <Switch label={`${t('enable')}: ${row.label}`} checked={row.enabled} disabled={busy || (!row.enabled && !row.configured && !row.keyOptional)} onChange={enabled => { void save('provider', { provider: row.id, enabled }) }} /></div>
        <div className="dsh-search-status"><StateDot state={row.configured || row.keyOptional ? 'done' : 'pending'} size={10} /><span>{t(row.configured ? 'keySaved' : row.keyOptional ? 'keyOptional' : 'keyMissing')}</span>{row.source && row.source !== 'saved' && <span>{row.source}</span>}</div>
        <div className="dsh-search-actions">
          {row.supportsKeys && <Button variant="outline" size="sm" disabled={busy || !row.writable} onClick={() => setDialog({ kind: 'key', provider: row.id })}>{t(row.configured ? 'editKey' : 'saveKey')}</Button>}
          {row.webSearch && snapshot.searchProvider !== providerRoute(row.id) && <Button variant="outline" size="sm" disabled={busy || !row.enabled} onClick={() => { void save('default', { provider: row.id }) }}>{t('setDefault')}</Button>}
          <Button variant="outline" size="sm" disabled={busy} onClick={() => setDialog({ kind: 'features', provider: row.id })}>{t('selectTools')}</Button>
          {OPTION_FIELDS[row.id].length > 0 && <Button variant="outline" size="sm" disabled={busy} onClick={() => setDialog({ kind: 'search', provider: row.id })}>{t('searchSettings')}</Button>}
        </div>
      </article>)}
    </div>}
    {dialog?.kind === 'key' && entry && <KeyDialog entry={entry} controller={controller} t={t} onClose={() => setDialog(undefined)} />}
    {dialog?.kind === 'features' && entry && snapshot && <FeaturesDialog entry={entry} snapshot={snapshot} controller={controller} t={t} onClose={() => setDialog(undefined)} />}
    {dialog?.kind === 'search' && entry && snapshot && <SearchOptionsDialog key={entry.id} entry={entry} snapshot={snapshot} controller={controller} t={t} onClose={() => setDialog(undefined)} />}
  </section>
}
export function apply(ctx: ClientContext): void {
  const controller = new SearchController(ctx.connection), updates = new UpdateController(ctx.connection)
  ctx.effect(() => () => { controller.dispose(); updates.dispose() })
  ctx.effect(() => ctx.locale.register(COPY_NS, { en, ja, zh }))
  ctx.effect(() => {
    const style = document.createElement('style'); style.dataset.dshSearchProviders = ''; style.textContent = css; document.head.append(style)
    return () => style.remove()
  })
  ctx.on('connection/reset', () => { controller.refreshIfLoaded(); updates.reset() })
  ctx.effect(() => {
    const disposers = ['settings/document-updated', 'credentials/record-updated', 'credentials/reference-updated']
      .map(event => ctx.remote?.$on(event, () => controller.refreshIfLoaded()))
    return () => { for (const dispose of disposers) dispose?.() }
  })
  ctx.slots.inject('settings.section', () => ctx.slots.register({ name: 'settings.section', id: 'web-search-provider', order: 15,
    label: () => ctx.locale.bind(COPY_NS)('nav'), icon: IconSearchOutlineRegular, inject: () => ({ controller, locale: ctx.locale, updates }),
  }, SearchSettings))
}
