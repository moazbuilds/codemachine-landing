/**
 * HeroCommandPanel Component
 * Task: I2.T1 - HeroCommandPanel Implementation
 *
 * Main hero section featuring:
 * - Headline with gradient typography
 * - Beta pill badge
 * - Command snippet with copy-to-clipboard interaction
 * - Documentation CTA with external link
 * - Telemetry status label
 * - IntersectionObserver-based fade-in animation
 *
 * Acceptance Criteria:
 * - Responsive layout with Aura theming
 * - Copy button with <150ms response or fallback
 * - Docs link opens in new tab with rel="noopener noreferrer"
 * - Analytics events for copy/docs interactions
 * - Passes Lighthouse accessibility checks
 * - Focus order preserved for keyboard navigation
 *
 * Architecture (from src/components/ExperienceShell/index.tsx:*):
 * - Consumes HeroContent from @/content/hero
 * - Uses FeatureFlagContext for clipboard gating
 * - Emits analytics via shared trackEvent helper
 */

import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'
import { heroContent } from '@/content'
import { useFeatureFlag } from '@/components/ExperienceShell/FeatureFlagContext'
import { useClipboardCommand } from '@/hooks/useClipboardCommand'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useScrollRevealContext } from '@/context/ScrollRevealProvider'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

/**
 * HeroCommandPanel - Primary landing section with command interaction
 *
 * Layout structure:
 * 1. Beta badge (pill)
 * 2. Kicker text (small label)
 * 3. Hero headline (large gradient text)
 * 4. Description paragraph
 * 5. Command bar (readonly input + copy button)
 * 6. CTA row (docs link + telemetry label)
 *
 * @example
 * ```tsx
 * <HeroCommandPanel />
 * ```
 */
export function HeroCommandPanel() {
  const { isEnabled } = useFeatureFlag()
  const sectionRef = useRef<HTMLElement>(null)
  const isVisible = useScrollReveal(sectionRef)
  const { reducedMotion } = useScrollRevealContext()
  const heroVisible = reducedMotion || isVisible

  const clipboardEnabled = isEnabled('clipboardInteractions')

  // Clipboard hook integration
  const { status, commandRef, copy } = useClipboardCommand({
    command: heroContent.installCommand,
    onSuccess: () => {
      trackEvent('hero_copy_success', {
        command: heroContent.installCommand,
        method: 'clipboard_api',
      })
    },
    onError: (error) => {
      trackEvent('hero_copy_fallback', {
        command: heroContent.installCommand,
        error: error.message,
        method: 'text_selection',
      })
    },
  })

  // Handle docs link click
  const handleDocsClick = () => {
    trackEvent('hero_docs_click', {
      url: heroContent.docsUrl,
      label: heroContent.ctas.primary,
    })
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Hero command panel"
      className={cn(
        'hero-section',
        'relative mx-auto max-w-4xl',
        'px-6 py-16 md:py-24 lg:py-32',
        heroVisible && 'is-visible'
      )}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        {/* Beta Badge */}
        {heroContent.betaLabel && (
          <div
            className="inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-1.5"
            role="status"
            aria-label={`${heroContent.betaLabel} release`}
          >
            <span className="h-2 w-2 rounded-full bg-primary-400 motion-safe:animate-pulse" />
            <span className="label-telemetry text-primary-300">
              {heroContent.betaLabel}
            </span>
          </div>
        )}

        {/* Kicker */}
        <p className="label-telemetry text-neutral-500">{heroContent.kicker}</p>

        {/* Hero Headline */}
        <h1 className="heading-hero text-gradient-primary glow-text-primary">
          {heroContent.title}
        </h1>

        {/* Description */}
        <p className="body-long max-w-2xl text-neutral-400">
          {heroContent.description}
        </p>

        {/* Command Bar */}
        <div className="command-bar-container mt-4 w-full max-w-2xl">
          <div className="glass-surface flex items-center gap-3 rounded-xl border border-white/10 p-4 shadow-lg">
            {/* Command Text */}
            <code
              ref={commandRef}
              className="flex-1 select-all font-mono text-sm text-primary-300 md:text-base"
              tabIndex={0}
              role="textbox"
              aria-label="Installation command"
              aria-readonly="true"
            >
              {heroContent.installCommand}
            </code>

            {/* Copy Button */}
            {clipboardEnabled ? (
              <CopyButton status={status} onClick={copy} />
            ) : (
              <div
                className="rounded-lg border border-dashed border-white/10 px-3 py-2 text-xs text-neutral-500"
                role="status"
              >
                Copy disabled
              </div>
            )}
          </div>

          {/* Helper text for manual copy fallback */}
          {status === 'error' && (
            <p
              className="mt-2 text-sm text-neutral-500"
              role="alert"
              aria-live="polite"
            >
              Command highlighted — press{' '}
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-xs">
                Ctrl+C
              </kbd>{' '}
              to copy
            </p>
          )}
        </div>

        {/* CTA Row */}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          {/* Documentation Link */}
          <a
            href={heroContent.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDocsClick}
            className="btn-primary group inline-flex items-center gap-2"
          >
            <span>{heroContent.ctas.primary}</span>
            <ExternalLink
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>

          {/* Telemetry Label */}
          <div
            className="label-telemetry text-neutral-600"
            role="status"
            aria-label="System status"
          >
            {heroContent.telemetryLabel}
          </div>
        </div>
      </div>
    </section>
  )
}
