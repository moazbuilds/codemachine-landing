/**
 * ScrollReveal Context
 * Task: I2.T4 - Re-export upgraded provider from src/context/ScrollRevealProvider.tsx
 *
 * This module maintains backward compatibility for existing imports
 * while delegating implementation to the centralized provider.
 *
 * The actual ScrollRevealProvider implementation now lives in:
 * src/context/ScrollRevealProvider.tsx
 *
 * Referenced by:
 * - src/components/ExperienceShell/index.tsx (wraps children)
 * - src/hooks/useScrollReveal.ts (calls register/unregister)
 */

import type { ReactNode } from 'react'
import {
  ScrollRevealProvider as ScrollRevealProviderImpl,
  useScrollRevealContext,
} from '@/context/ScrollRevealProvider'

/**
 * Legacy interface for backward compatibility
 * Consumers can call register/unregister without callbacks
 */
interface ScrollRevealContextValue {
  /**
   * Register an element for scroll-based reveal animation.
   * @param element - The DOM element to observe
   */
  register: (element: HTMLElement) => void

  /**
   * Unregister an element from scroll-based reveal animation.
   * @param element - The DOM element to stop observing
   */
  unregister: (element: HTMLElement) => void
}

/**
 * Hook to access scroll reveal registration methods.
 * @returns ScrollRevealContextValue with register/unregister functions
 * @throws Error if used outside ScrollRevealProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useScrollReveal(): ScrollRevealContextValue {
  const context = useScrollRevealContext()

  // Return simplified interface without exposing callback parameter
  // (hooks like useScrollReveal.ts manage their own callbacks)
  return {
    register: (element: HTMLElement) => {
      // No-op registration for legacy compatibility
      // The actual hook (src/hooks/useScrollReveal.ts) manages its own observer
      context.register(element, () => {
        // Callback handled by individual hooks
      })
    },
    unregister: context.unregister,
  }
}

interface ScrollRevealProviderProps {
  children: ReactNode
}

/**
 * Provider component for scroll reveal context.
 * Re-exports the full implementation from src/context/ScrollRevealProvider.tsx
 */
export function ScrollRevealProvider({ children }: ScrollRevealProviderProps) {
  return <ScrollRevealProviderImpl>{children}</ScrollRevealProviderImpl>
}
