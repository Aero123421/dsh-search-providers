import type { SettingsProblem } from './catalog.ts'
import type { CopyKey } from './locales.ts'

/** Wording for one saved entry the running plugin will not apply. */
export function problemCopyKey(problem: SettingsProblem): CopyKey {
  if (problem.reason === 'invalid-search') return 'ignoredSearch'
  if (problem.reason === 'invalid-state') return 'ignoredState'
  if (!problem.id) return 'ignoredSection'
  if (problem.reason === 'malformed') return problem.scope === 'tools' ? 'ignoredToolValue' : 'ignoredProviderValue'
  return problem.scope === 'tools' ? 'ignoredTool' : 'ignoredProvider'
}

/**
 * Card title for an ignored entry.
 * Known providers use their catalog label, including when the saved value itself is unreadable.
 * Known features use the translated capability name. Unknown ids stay literal and are shortened.
 */
export function problemHeading(problem: SettingsProblem, providerLabel: string | undefined, toolLabel: string | undefined): string {
  if (problem.scope === 'providers' && providerLabel && (problem.reason === 'invalid-search' || problem.reason === 'invalid-state' || problem.reason === 'malformed')) return providerLabel
  if (!problem.id) return ''
  if (problem.scope === 'tools' && toolLabel) return toolLabel
  return problem.id.length > 80 ? `${problem.id.slice(0, 79)}…` : problem.id
}
