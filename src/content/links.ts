// Diagram: Data Model ERD (I1.T2)
// External links module - provides typed external navigation links and star metrics

import type { ExternalLink, StarMetric } from './types'

/**
 * External links displayed in the footer or navigation.
 * Each link includes a label, href, and optional description.
 */
export const externalLinks: readonly ExternalLink[] = [
  {
    label: 'GitHub Repo',
    href: 'https://github.com/moazbuilds/CodeMachine-CLI',
    description: 'Source of truth for the CodeMachine CLI and docs.',
  },
  {
    label: 'Design Spec',
    href: '/docs/diagrams/component.md',
    description: 'Planned component diagram for the ExperienceShell.',
  },
] as const

/**
 * Star metrics displayed in telemetry badges.
 * Each metric includes a label and value.
 */
export const starMetrics: readonly StarMetric[] = [
  { label: 'Framework', value: 'React 18' },
  { label: 'Build Tool', value: 'Vite 5' },
  { label: 'Theme', value: 'Aura Dark' },
] as const

/**
 * Helper function to generate fallback copy when GitHub star fetch fails.
 * @param repoName - Reserved for future repo-specific copy
 * @returns Fallback text (defaults to "100+ Stars")
 */
export function buildFallbackStarCopy(repoName: string): string {
  void repoName
  return '100+ Stars'
}
