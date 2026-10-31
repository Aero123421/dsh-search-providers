import React from 'react'
import * as ReactDom from 'react-dom'
import * as ReactJsxRuntime from 'react/jsx-runtime'
import * as UiPrimitives from '@deepseek-ai/dsh-client-ui-primitives'
import { Context } from '@deepseek-ai/cordis'
import { apply as renderer } from '@deepseek-ai/dsh-client-ui-renderer/client'
import { LocaleRuntime } from '@deepseek-ai/dsh-client-locale/client'
import { createWebConnectionRpc } from '../.cache/upstream/packages/client/connection/src/client/rpc.ts'
const factories = new Map()
window.__ModuleLoader__ = { load: ({ id, factory }) => factories.set(id, factory) }
window.mountPlugins = async () => {
  const ctx = new Context(), locale = new LocaleRuntime(ctx)
  ctx.effect(() => locale.addLanguage({ id: 'ja', label: '日本語', fallback: 'en' }))
  ctx.provide('locale', locale)
  ctx.provide('connection', { rpc: createWebConnectionRpc(), isLoopback: true })
  ctx.provide('remote', { $on: () => () => {} })
  const root = ctx.plugin(renderer); await root.await()
  const absent = Object.freeze({ key: undefined, hooks: {}, keyedHooks: {}, props: {} })
  const source = { getSnapshot: () => absent, subscribe: () => () => {} }
  ctx.slots.installScope('session', { current: source, bindingSource: () => source })
  ctx.slots.register({ name: 'root', id: 'settings-fixture', children: { 'settings.section': { kind: 'list', scope: 'root' } } }, ({ renderSlot }) => <main className="fixture-settings">{renderSlot('settings.section', {})}</main>)
  const shared = { react: React, 'react-dom': ReactDom, 'react/jsx-runtime': ReactJsxRuntime, '@deepseek-ai/dsh-client-ui-primitives': UiPrimitives }
  const plugin = factories.get('@aero123421/dsh-search-providers')(specifier => {
    if (specifier in shared) return shared[specifier]
    throw new Error(`Unexpected external: ${specifier}`)
  })
  const fiber = ctx.plugin(plugin); await fiber.await()
  await locale.setLocale('ja'); document.documentElement.lang = 'ja'
  const unmount = ctx.uiRenderer.mount(document.getElementById('app'))
  window.testRuntime = { ctx, locale, closeTopModal: UiPrimitives.closeTopModal, isBehindModal: UiPrimitives.isBehindModal, dispose: async () => { unmount(); await fiber.dispose(); await root.dispose(); await ctx.fiber.dispose() } }
}
