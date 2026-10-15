import semver from 'semver'

// 0.2.1-alpha.2 is the API this plugin is built and tested against. 0.2.0-rc.2 is older
// than that and is not included. `<0.3.0-0` excludes 0.3.0 and its prereleases while
// still matching later 0.2.x prereleases under app-boot's includePrerelease check.
export const DSH_PEER_RANGE = '>=0.2.1-alpha.2 <0.3.0-0'
const ACCEPTED = ['0.2.1-alpha.2', '0.2.1-alpha.3', '0.2.1', '0.2.2-alpha.1', '0.2.2-rc.1', '0.2.9']
const REJECTED = ['0.2.1-alpha.1', '0.2.0-rc.2', '0.3.0-alpha.1', '0.3.0']

export function dshPeerRanges(manifest) {
  const peers = manifest?.peerDependencies
  if (!peers || typeof peers !== 'object' || Array.isArray(peers)) return []
  return Object.entries(peers).filter(([name]) => name === '@deepseek-ai/dsh' || name.startsWith('@deepseek-ai/dsh-'))
}

export function peerRangeErrors(manifest, evaluate) {
  const errors = []
  const peers = dshPeerRanges(manifest)
  if (peers.length === 0) errors.push('package.json has no @deepseek-ai/dsh* peerDependencies')
  for (const [name, range] of peers) {
    if (typeof range !== 'string' || range !== DSH_PEER_RANGE) errors.push(`${name} must be ${JSON.stringify(DSH_PEER_RANGE)}`)
    if (typeof range === 'string' && semver.valid(range)) errors.push(`${name} is an exact version, so the next DSH release will skip this plugin`)
  }
  for (const version of ACCEPTED) {
    const issue = evaluate(manifest, {}, version)
    if (issue) errors.push(`dsh ${version} is rejected: ${JSON.stringify(issue.peers)}`)
  }
  for (const version of REJECTED) {
    const issue = evaluate(manifest, {}, version)
    if (!issue) errors.push(`dsh ${version} was accepted`)
  }
  return errors
}

export function publishedVersionErrors(manifest, versions, distTags, evaluate) {
  const errors = []
  const valid = versions.filter(version => semver.valid(version))
  for (const version of ['0.2.1-alpha.2', '0.2.1-alpha.3']) {
    if (!valid.includes(version)) errors.push(`npm has no @deepseek-ai/dsh@${version}`)
  }
  const newest = [...valid].sort(semver.rcompare)[0]
  const alpha = distTags?.alpha
  for (const version of new Set([newest, alpha].filter(version => typeof version === 'string'))) {
    const issue = evaluate(manifest, {}, version)
    if (issue) errors.push(`@deepseek-ai/dsh@${version} is outside peerDependencies ${JSON.stringify(issue.peers)}; app-boot will skip this plugin`)
  }
  for (const version of valid) {
    if (!semver.satisfies(version, DSH_PEER_RANGE, { includePrerelease: true })) continue
    const issue = evaluate(manifest, {}, version)
    if (issue) errors.push(`published ${version} is inside ${DSH_PEER_RANGE} but app-boot rejects ${JSON.stringify(issue.peers)}`)
  }
  return errors
}
