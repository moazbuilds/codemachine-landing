/**
 * FeatureCard - Individual feature card for bento grid
 * Task: I3.T1 - FeatureBentoGrid Implementation
 *
 * Implements:
 * - Glass card styling with Aura tokens
 * - Hover states with inner glow and ring effects
 * - Scroll-triggered fade-up animations via ScrollReveal
 * - Icon rendering with semantic colors
 * - Responsive layout support
 *
 * Accessibility:
 * - Uses <article> element for semantic structure
 * - Supports prefers-reduced-motion
 * - Touch device fallbacks for hover states
 * - ARIA relationships via describedby
 */

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { Sparkles, Zap, Terminal, Cpu, FileCode, Clock, ShieldCheck, Rocket, type LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { useScrollRevealContext } from '@/context/ScrollRevealProvider'
import type { FeatureCard as FeatureCardType } from '@/content/types'

// Icon mapping for type-safe icon rendering
const iconMap: Record<FeatureCardType['icon'], LucideIcon> = {
  sparkles: Sparkles,
  zap: Zap,
  terminal: Terminal,
  cpu: Cpu,
  'file-code': FileCode,
  clock: Clock,
  'shield-check': ShieldCheck,
  rocket: Rocket,
}

interface FeatureCardProps {
  card: FeatureCardType
  index: number
}

export function FeatureCard({ card, index }: FeatureCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [tapActive, setTapActive] = useState(false)
  const { register, unregister, reducedMotion } = useScrollRevealContext()

  const IconComponent = iconMap[card.icon] ?? Terminal

  const gridSpanClasses = clsx(
    'col-span-1',
    card.gridSpan?.mobile,
    card.gridSpan?.desktop
  )

  const desktopSpanAttribute = card.gridSpan?.desktop?.match(/col-span-(\d+)/)?.[1]
  const rowSpanAttribute = card.gridSpan?.desktop?.match(/row-span-(\d+)/)?.[1]

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') {
        setTapActive((prev) => !prev)
      }
    },
    []
  )

  // Register with ScrollReveal on mount
  useEffect(() => {
    const element = cardRef.current
    if (!element) return

    let hasRevealed = false

    register(element, (visible) => {
      if (visible && !hasRevealed) {
        hasRevealed = true
        setIsVisible(true)
        unregister(element)
      }
    })

    return () => {
      unregister(element)
    }
  }, [register, unregister])

  return (
    <article
      ref={cardRef}
      id={`feature-${card.id}`}
      aria-describedby={`feature-${card.id}-description`}
      className={clsx(
        'feature-card p-6 bg-white/5 border border-white/10 rounded-lg hover:border-cyan-400/40 transition-all duration-300',
        gridSpanClasses,
        isVisible && 'is-visible',
        card.gridSpan?.desktop?.includes('col-span-2') && 'md:col-span-2'
      )}
      data-tap-active={tapActive ? 'true' : undefined}
      data-span={desktopSpanAttribute}
      data-row-span={rowSpanAttribute}
      onPointerDown={handlePointerDown}
      style={
        reducedMotion
          ? undefined
          : {
              animationDelay: `${index * 90}ms`,
            }
      }
    >
      {/* Card content */}
      <div className="flex flex-col h-full gap-4">
        {/* Icon - Simple, no box */}
        <IconComponent className="w-5 h-5 text-cyan-400" aria-hidden="true" />

        {/* Text content */}
        <div>
          <h3 className="text-base font-medium text-white mb-2">
            {card.title}
          </h3>
          <p
            id={`feature-${card.id}-description`}
            className="text-sm text-neutral-500 leading-relaxed"
          >
            {card.description}
          </p>
        </div>
      </div>
    </article>
  )
}
