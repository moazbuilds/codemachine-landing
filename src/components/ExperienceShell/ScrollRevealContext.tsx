/**
 * ScrollReveal Context
 * Referenced by: src/components/ExperienceShell/index.tsx:*
 *
 * TODO (I2+): Implement scroll-based reveal animation orchestration
 * This context will manage IntersectionObserver registration and
 * coordinate scroll-triggered animations across child components.
 *
 * Future hooks (e.g., useScrollReveal) will consume this context
 * to register elements for reveal animations when they enter the viewport.
 */

import { createContext, useContext, type ReactNode } from 'react'

interface ScrollRevealContextValue {
  /**
   * Register an element for scroll-based reveal animation.
   * TODO: Implement IntersectionObserver logic in future iteration.
   * @param element - The DOM element to observe
   */
  register: (element: HTMLElement) => void

  /**
   * Unregister an element from scroll-based reveal animation.
   * TODO: Cleanup observer when element unmounts.
   * @param element - The DOM element to stop observing
   */
  unregister: (element: HTMLElement) => void
}

const ScrollRevealContext = createContext<ScrollRevealContextValue | null>(null)

/**
 * Hook to access scroll reveal registration methods.
 * @returns ScrollRevealContextValue with register/unregister functions
 * @throws Error if used outside ScrollRevealProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useScrollReveal(): ScrollRevealContextValue {
  const context = useContext(ScrollRevealContext)
  if (!context) {
    throw new Error('useScrollReveal must be used within ScrollRevealProvider')
  }
  return context
}

interface ScrollRevealProviderProps {
  children: ReactNode
}

/**
 * Provider component for scroll reveal context.
 * Currently provides no-op implementations; will be enhanced in future iterations.
 */
export function ScrollRevealProvider({ children }: ScrollRevealProviderProps) {
  // TODO (I2+): Initialize IntersectionObserver with threshold/rootMargin config
  // TODO (I2+): Maintain Set<HTMLElement> of registered elements
  // TODO (I2+): Apply .visible class when elements intersect viewport

  const contextValue: ScrollRevealContextValue = {
    register: () => {
      // No-op placeholder - future implementation will attach observer
    },
    unregister: () => {
      // No-op placeholder - future implementation will detach observer
    },
  }

  return (
    <ScrollRevealContext.Provider value={contextValue}>
      {children}
    </ScrollRevealContext.Provider>
  )
}
