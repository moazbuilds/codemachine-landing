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
import { Sparkles, Zap, Terminal, type LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { useScrollRevealContext } from '@/context/ScrollRevealProvider'
import type { FeatureCard as FeatureCardType } from '@/content/types'

// Icon mapping for type-safe icon rendering
const iconMap: Record<FeatureCardType['icon'], LucideIcon> = {
  sparkles: Sparkles,
  zap: Zap,
  terminal: Terminal,
}

// Accent color mappings
const accentColors: Record<FeatureCardType['accent'], {
  icon: string
  glow: string
  ring: string
}> = {
  primary: {
    icon: 'text-primary-400',
    glow: 'from-primary-500/20 to-transparent',
    ring: 'ring-primary-500/10',
  },
  emerald: {
    icon: 'text-emerald-400',
    glow: 'from-emerald-400/20 to-transparent',
    ring: 'ring-emerald-400/10',
  },
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
  const colors = accentColors[card.accent] ?? accentColors.primary

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
        'feature-card glass-surface group relative overflow-hidden rounded-2xl border border-white/5 p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-black/30',
        gridSpanClasses,
        isVisible && 'is-visible'
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
      {/* Accent glow overlay (shown on hover if accentGlow enabled) */}
      {card.accentGlow && (
        <div
          className={`
            pointer-events-none
            absolute
            inset-0
            opacity-0
            transition-opacity
            duration-500
            group-hover:opacity-100
            bg-gradient-radial
            ${colors.glow}
          `}
          aria-hidden="true"
        />
      )}

      {/* Inner glow ring on hover */}
      <div
        className={`
          inner-glow-overlay
          absolute
          inset-0
          rounded-2xl
          opacity-0
          ring-1
          ring-inset
          ring-white/10
          transition-opacity
          duration-300
          group-hover:opacity-100
        `}
        aria-hidden="true"
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col gap-4">
        {/* Icon */}
        <div
          className={clsx(
            'feature-card__icon-shell flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 transition-all duration-300 group-hover:bg-white/10 ring-1 ring-inset',
            colors.ring
          )}
        >
          <IconComponent className={`h-6 w-6 ${colors.icon}`} aria-hidden="true" />
        </div>

        {/* Text content */}
        <div className="flex flex-col gap-2">
          <h3 className="heading-section text-gradient-primary">
            {card.title}
          </h3>
          <p
            id={`feature-${card.id}-description`}
            className="feature-card__description text-sm leading-relaxed text-neutral-400 transition-colors duration-300 group-hover:text-neutral-300"
          >
            {card.description}
          </p>
        </div>

        {/* Optional CTA label */}
        {card.ctaLabel && (
          <div className="mt-auto pt-2">
            <span className="feature-card__cta label-telemetry text-primary-400 transition-colors duration-300 group-hover:text-primary-300">
              {card.ctaLabel} →
            </span>
          </div>
        )}
      </div>
    </article>
  )
}
