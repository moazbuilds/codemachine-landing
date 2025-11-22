/**
 * useScrollReveal Hook
 * Task: I2.T4 - Updated to use shared ScrollRevealProvider
 *
 * Referenced by: src/components/VisualSimulationWindow/index.tsx
 *
 * Wraps ScrollRevealContext to provide scroll-based animation visibility state.
 * Now uses the centralized provider for optimal performance.
 * Respects prefers-reduced-motion for accessibility (WCAG 2.1 AA).
 *
 * Benefits of shared provider:
 * - Single IntersectionObserver instance across all components
 * - Automatic reduced-motion handling
 * - Consistent animation timing
 * - Lower memory overhead
 *
 * Usage:
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null)
 * const isVisible = useScrollReveal(containerRef)
 * ```
 */

import { useEffect, useState, type RefObject } from 'react'
import { useScrollRevealContext } from '@/context/ScrollRevealProvider'

/**
 * Custom hook for scroll-based reveal animations.
 *
 * @param elementRef - Ref to the DOM element to observe
 * @returns Boolean indicating whether the element is visible in viewport
 */
export function useScrollReveal(elementRef: RefObject<HTMLElement>): boolean {
  const [isVisible, setIsVisible] = useState(false)
  const { register, unregister, reducedMotion } = useScrollRevealContext()

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // If reduced motion is enabled, immediately mark visible
    if (reducedMotion) {
      setIsVisible(true)
      return
    }

    // Register with shared provider, passing visibility callback
    register(element, (visible) => {
      if (visible) {
        setIsVisible(true)
      }
    })

    return () => {
      unregister(element)
    }
  }, [elementRef, register, unregister, reducedMotion])

  return isVisible
}
