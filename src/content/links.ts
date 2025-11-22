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
    href: 'https://x.com/CodeMachineCLI',
    description: 'Follow CodeMachine updates on Twitter/X.',
    icon: 'Twitter',
    ariaLabel: 'Follow us on Twitter (opens in new tab)',
    location: ['both'],
    newTab: true,
    analyticsEventName: 'social_link_click',
  },
  {
    label: 'Discord',
    href: 'https://discord.gg/qYDPwEeW',
    description: 'Join the CodeMachine community on Discord.',
    icon: 'MessageCircle',
    ariaLabel: 'Join our Discord server (opens in new tab)',
    location: ['both'],
    newTab: true,
    analyticsEventName: 'social_link_click',
  },
  {
    label: 'Reddit',
    href: 'https://www.reddit.com/r/CodeMachine/',
    description: 'Join the CodeMachine subreddit.',
    icon: 'MessageSquare',
    ariaLabel: 'Visit our Reddit community (opens in new tab)',
    location: ['both'],
    newTab: true,
    analyticsEventName: 'social_link_click',
  },
] as const

/**
 * AI Engine integrations supported by CodeMachine.
 * Shows which AI tools can be orchestrated.
 */
export const aiIntegrations: readonly StarMetric[] = [
  { label: 'Claude Code', value: 'Supported' },
  { label: 'Cursor CLI', value: 'Supported' },
  { label: 'Codex CLI', value: 'Supported' },
  { label: 'OpenCode CLI', value: 'Supported' },
  { label: 'Auggie CLI', value: 'Supported' },
  { label: 'Gemini CLI', value: 'Coming Soon' },
  { label: 'Qwen Coder', value: 'Coming Soon' },
  { label: 'CodeRabbit CLI', value: 'Coming Soon' },
] as const

/**
 * Technology stack metrics for display.
 * Shows tech used in example projects.
 */
export const techStack: readonly StarMetric[] = [
  { label: 'Runtime', value: 'Bun' },
  { label: 'Language', value: 'TypeScript' },
  { label: 'Proven On', value: 'React • FastAPI • NestJS' },
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
