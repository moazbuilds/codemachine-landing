/**
 * useScrollReveal Hook
 * Referenced by: src/components/VisualSimulationWindow/index.tsx
 *
 * Wraps ScrollRevealContext to provide scroll-based animation visibility state.
 * Respects prefers-reduced-motion for accessibility.
 *
 * Usage:
 * ```tsx
 * const containerRef = useRef<HTMLDivElement>(null)
 * const isVisible = useScrollReveal(containerRef)
 * ```
 */

import { useEffect, useState, type RefObject } from 'react'
import { useScrollReveal as useScrollRevealContext } from '@/components/ExperienceShell/ScrollRevealContext'

/**
 * Custom hook for scroll-based reveal animations.
 *
 * @param elementRef - Ref to the DOM element to observe
 * @returns Boolean indicating whether the element is visible in viewport
 */
export function useScrollReveal(elementRef: RefObject<HTMLElement>): boolean {
  const [isVisible, setIsVisible] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const context = useScrollRevealContext()

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // If reduced motion is enabled, default to visible
    if (reducedMotion) {
      setIsVisible(true)
      return
    }

    // Register with context (currently no-op, but future-proof)
    context.register(element)

    // Implement our own IntersectionObserver since context is currently no-op
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Once visible, we can stop observing
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -100px 0px', // Start animation slightly before entering viewport
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      context.unregister(element)
    }
  }, [elementRef, context, reducedMotion])

  return isVisible
}
