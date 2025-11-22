/**
 * ScrollRevealProvider - Shared IntersectionObserver for scroll-based animations
 * Task: I2.T4 - Accessibility & Polish
 *
 * Implements centralized scroll reveal logic with:
 * - Single shared IntersectionObserver instance for performance
 * - Automatic prefers-reduced-motion support
 * - Element registration/unregistration lifecycle management
 * - Callback-based visibility notifications
 *
 * Architecture Benefits:
 * - Reduces observer instances from O(n) to O(1)
 * - Meets performance budgets (LCP < 2.5s, TTI < 3.0s)
 * - Respects WCAG 2.1 AA motion preferences
 * - Enables SSR/testing short-circuits via manual triggers
 *
 * Used by: src/components/ExperienceShell/ScrollRevealContext.tsx
 */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  useCallback,
} from 'react'

/**
 * Callback invoked when an element's visibility changes
 * @param isVisible - Whether the element is currently visible in viewport
 */
type VisibilityCallback = (isVisible: boolean) => void

/**
 * Context value exposed to consumers
 */
export interface ScrollRevealContextValue {
  /**
   * Register an element for scroll-based reveal observation
   * @param element - DOM element to observe
   * @param callback - Function called when visibility changes
   */
  register: (element: HTMLElement, callback: VisibilityCallback) => void

  /**
   * Unregister an element from observation
   * @param element - DOM element to stop observing
   */
  unregister: (element: HTMLElement) => void

  /**
   * Whether reduced motion preference is active
   * When true, all animations should be disabled
   */
  reducedMotion: boolean

  /**
   * Manually trigger visibility for an element (for SSR/testing)
   * @param element - DOM element to mark as visible
   */
  triggerReveal?: (element: HTMLElement) => void
}

const ScrollRevealContext = createContext<ScrollRevealContextValue | null>(null)

/**
 * Hook to access scroll reveal context
 * @returns ScrollRevealContextValue
 * @throws Error if used outside provider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useScrollRevealContext(): ScrollRevealContextValue {
  const context = useContext(ScrollRevealContext)
  if (!context) {
    throw new Error(
      'useScrollRevealContext must be used within ScrollRevealProvider'
    )
  }
  return context
}

interface ScrollRevealProviderProps {
  children: ReactNode
  /**
   * IntersectionObserver configuration
   * Defaults: threshold 0.1, rootMargin '0px 0px -100px 0px'
   */
  observerOptions?: IntersectionObserverInit
}

/**
 * ScrollRevealProvider - Centralized scroll animation orchestration
 *
 * Creates a single IntersectionObserver instance shared across all
 * registered elements to minimize performance overhead.
 *
 * Automatically disables observer setup when prefers-reduced-motion
 * is active, immediately marking all elements as visible instead.
 *
 * @example
 * ```tsx
 * <ScrollRevealProvider>
 *   <YourComponents />
 * </ScrollRevealProvider>
 * ```
 */
export function ScrollRevealProvider({
  children,
  observerOptions,
}: ScrollRevealProviderProps) {
  // Track registered elements and their callbacks
  const registryRef = useRef<Map<HTMLElement, VisibilityCallback>>(new Map())

  // Single shared IntersectionObserver instance
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Track reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  // Listen for reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)

      // If reduced motion becomes active, immediately reveal all registered elements
      if (e.matches) {
        registryRef.current.forEach((callback) => {
          callback(true)
        })
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Initialize IntersectionObserver when reduced motion is off
  useEffect(() => {
    // Skip observer setup if reduced motion is enabled
    if (reducedMotion) {
      // Clean up existing observer if it exists
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      return
    }

    // Create shared observer instance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const callback = registryRef.current.get(
            entry.target as HTMLElement
          )
          if (callback) {
            callback(entry.isIntersecting)

            // Once visible, optionally unobserve to optimize performance
            // (elements typically don't need to re-animate when scrolling back up)
            if (entry.isIntersecting) {
              observer.unobserve(entry.target)
            }
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before entering viewport
        ...observerOptions,
      }
    )

    observerRef.current = observer

    // Observe all currently registered elements
    registryRef.current.forEach((_, element) => {
      observer.observe(element)
    })

    return () => {
      observer.disconnect()
      observerRef.current = null
    }
  }, [reducedMotion, observerOptions])

  /**
   * Register an element for scroll observation
   */
  const register = useCallback(
    (element: HTMLElement, callback: VisibilityCallback) => {
      registryRef.current.set(element, callback)

      // If reduced motion is active, immediately mark visible
      if (reducedMotion) {
        callback(true)
        return
      }

      // Otherwise, start observing
      if (observerRef.current) {
        observerRef.current.observe(element)
      }
    },
    [reducedMotion]
  )

  /**
   * Unregister an element from observation
   */
  const unregister = useCallback((element: HTMLElement) => {
    registryRef.current.delete(element)

    if (observerRef.current) {
      observerRef.current.unobserve(element)
    }
  }, [])

  /**
   * Manually trigger reveal for an element (useful for testing/SSR)
   */
  const triggerReveal = useCallback((element: HTMLElement) => {
    const callback = registryRef.current.get(element)
    if (callback) {
      callback(true)
    }
  }, [])

  const contextValue: ScrollRevealContextValue = {
    register,
    unregister,
    reducedMotion,
    triggerReveal,
  }

  return (
    <ScrollRevealContext.Provider value={contextValue}>
      {children}
    </ScrollRevealContext.Provider>
  )
}
