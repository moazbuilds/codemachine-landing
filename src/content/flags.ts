// Diagram: Data Model ERD (I1.T2)
// Feature flags module - provides typed feature toggle configuration

import type { FeatureFlag } from './types'

/**
 * Feature flags for toggling application features.
 * Each flag includes a key, description, and enabled state.
 */
export const featureFlags: readonly FeatureFlag[] = [
  {
    key: 'enableGithubStars',
    description: 'Fetch GitHub stars for telemetry badge.',
    enabled: false,
  },
  {
    key: 'clipboardInteractions',
    description: 'Allow HeroCommandPanel copy-to-clipboard action.',
    enabled: true,
  },
] as const

/**
 * Helper function to check if a feature is enabled.
 * @param key - The feature flag key to check
 * @returns Boolean indicating if the feature is enabled
 */
export function isFeatureEnabled(key: string): boolean {
  const flag = featureFlags.find((f) => f.key === key)
  return flag?.enabled ?? false
}
