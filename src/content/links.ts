// Diagram: Data Model ERD (I1.T2)
// External links module - provides typed external navigation links and star metrics

import type { ExternalLink, StarMetric } from './types'

/**
 * External links displayed in navigation and/or footer.
 * Each link includes label, href, icon, location filtering, and accessibility metadata.
 */
export const externalLinks: readonly ExternalLink[] = [
  {
    label: 'Documentation',
    href: 'http://docs.codemachine.co/',
    description: 'Official CodeMachine documentation and guides.',
    icon: 'Book',
    ariaLabel: 'Read documentation (opens in new tab)',
    location: ['both'],
    newTab: true,
    analyticsEventName: 'hero_docs_click',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/moazbuilds/CodeMachine-CLI',
    description: 'Source code and issue tracker for CodeMachine CLI.',
    icon: 'Github',
    ariaLabel: 'View source on GitHub (opens in new tab)',
    location: ['both'],
    newTab: true,
    analyticsEventName: 'github_star_click',
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/codemachine',
    description: 'Follow CodeMachine updates on Twitter.',
    icon: 'Twitter',
    ariaLabel: 'Follow us on Twitter (opens in new tab)',
    location: ['footer'],
    newTab: true,
    analyticsEventName: 'social_link_click',
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
