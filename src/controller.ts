import { NS } from './catalog.ts'
import { parseSnapshot, type Snapshot } from './state.ts'
export interface Connection { rpc: { call(base: string, method: string, payload: unknown, signal?: AbortSignal): Promise<{ ok: true; value: unknown } | { ok: false; error: { code: string } }> } }
export interface PageState { status: 'idle' | 'loading' | 'ready'; snapshot?: Snapshot; error?: string }
export class SearchController {
  private state: PageState = { status: 'idle' }
  private readonly listeners = new Set<() => void>()
  private pending?: { abort: AbortController; promise: Promise<void> } | undefined
  private closed = false
  private readonly connection: Connection
  constructor(connection: Connection) { this.connection = connection }
  getSnapshot = () => this.state
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private publish(state: PageState) { if (this.closed) return; this.state = state; for (const listener of this.listeners) listener() }
  async call(method: string, payload: unknown = {}, signal?: AbortSignal): Promise<unknown> {
    const result = await this.connection.rpc.call('/api', `${NS}/${method}`, payload, signal)
    if (!result.ok) throw new Error(result.error.code)
    return result.value
  }
  load(): Promise<void> {
    if (this.closed) return Promise.resolve()
    if (this.pending) return this.pending.promise
    const request = { abort: new AbortController(), promise: Promise.resolve() }
    this.pending = request
    this.publish({ ...this.state, status: this.state.snapshot ? 'ready' : 'loading' })
    request.promise = this.call('list', {}, request.abort.signal).then(value => {
      if (this.pending === request) this.publish({ status: 'ready', snapshot: parseSnapshot(value) })
    }).catch(() => { if (this.pending === request) this.publish({ ...this.state, status: 'ready', error: 'loadFailed' }) })
      .finally(() => { if (this.pending === request) this.pending = undefined })
    return request.promise
  }
  refresh(): Promise<void> { this.pending?.abort.abort(); this.pending = undefined; return this.load() }
  refreshIfLoaded(): void { if (this.state.status !== 'idle') void this.refresh() }
  dispose(): void { this.closed = true; this.pending?.abort.abort(); this.pending = undefined; this.listeners.clear() }
}
