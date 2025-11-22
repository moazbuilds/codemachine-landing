/**
 * useCursorGlow Hook
 *
 * Creates a cursor-following glow/blur effect using CSS custom properties
 * and mouse position tracking. The effect is applied via a radial gradient
 * that follows the cursor position within the element.
 *
 * Usage:
 * ```tsx
 * const cursorGlowRef = useCursorGlow()
 * return <div ref={cursorGlowRef}>...</div>
 * ```
 */

import { useEffect, useRef } from 'react'

interface UseCursorGlowOptions {
  /**
   * Size of the glow effect in pixels
   * @default 600
   */
  glowSize?: number

  /**
   * Enable/disable the effect
   * @default true
   */
  enabled?: boolean
}

export function useCursorGlow(options: UseCursorGlowOptions = {}) {
  const { glowSize = 600, enabled = true } = options
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!enabled || !elementRef.current) return

    const element = elementRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Update CSS custom properties for the glow position
      element.style.setProperty('--cursor-x', `${x}px`)
      element.style.setProperty('--cursor-y', `${y}px`)
      element.style.setProperty('--glow-size', `${glowSize}px`)
    }

    const handleMouseLeave = () => {
      // Fade out the glow when cursor leaves
      element.style.setProperty('--cursor-x', '50%')
      element.style.setProperty('--cursor-y', '50%')
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [enabled, glowSize])

  return elementRef
}
