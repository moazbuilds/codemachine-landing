/**
 * FeatureFlag Context
 * Referenced by: src/components/ExperienceShell/index.tsx:*
 *
 * Provides feature flag state management across the application.
 * Seeded from featureFlags configuration in @/content module.
 *
 * Components can use useFeatureFlag hook to conditionally render
 * features based on flag state (e.g., GitHub stars, clipboard interactions).
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { featureFlags } from '@/content'
import type { FeatureFlag } from '@/content'

interface FeatureFlagContextValue {
  /**
   * All feature flags with their current state.
   */
  flags: readonly FeatureFlag[]

  /**
   * Check if a specific feature flag is enabled.
   * @param key - The feature flag key to check
   * @returns Boolean indicating if the feature is enabled
   */
  isEnabled: (key: string) => boolean
}

const FeatureFlagContext = createContext<FeatureFlagContextValue | null>(null)

/**
 * Hook to access feature flag state.
 * @returns FeatureFlagContextValue with flags array and isEnabled checker
 * @throws Error if used outside FeatureFlagProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFeatureFlag(): FeatureFlagContextValue {
  const context = useContext(FeatureFlagContext)
  if (!context) {
    throw new Error('useFeatureFlag must be used within FeatureFlagProvider')
  }
  return context
}

interface FeatureFlagProviderProps {
  children: ReactNode
}

/**
 * Provider component for feature flag context.
 * Seeds initial state from featureFlags configuration.
 *
 * TODO (I2+): Add runtime flag override support via localStorage/URL params
 * TODO (I2+): Add analytics logging when flags are checked
 */
export function FeatureFlagProvider({ children }: FeatureFlagProviderProps) {
  const contextValue: FeatureFlagContextValue = useMemo(
    () => ({
      flags: featureFlags,
      isEnabled: (key: string) => {
        const flag = featureFlags.find((f) => f.key === key)
        return flag?.enabled ?? false
      },
    }),
    []
  )

  return (
    <FeatureFlagContext.Provider value={contextValue}>
      {children}
    </FeatureFlagContext.Provider>
  )
}
