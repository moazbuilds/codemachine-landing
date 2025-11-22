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
import { useCursorGlow } from '@/hooks/useCursorGlow'
import { CopyButton } from './CopyButton'
import { GeometricDecor } from './GeometricDecor'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics'

// ASCII Art for CODE and MACHINE
const CODE_TEXT = [
  '   ██████╗ ██████╗ ██████╗ ███████╗',
  '  ██╔════╝██╔═══██╗██╔══██╗██╔════╝',
  '  ██║     ██║   ██║██║↓ ██║█████╗  ',
  '  ██║     ██║   ██║██║  ██║██╔══╝  ',
  '  ╚██████╗╚██████╔╝██████╔╝███████╗',
  '   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝',
]

const MACHINE_TEXT = [
  '  ███╗   ███╗ █████╗  ██████╗██╗  ██╗██╗███╗   ██╗███████╗',
  '  ████╗ ████║██╔══██╗██╔════╝██║  ██║██║████╗  ██║██╔════╝',
  '  ██╔████╔██║███████║██║     ███████║██║██╔██╗ ██║█████╗  ',
  '  ██║╚██╔╝██║██╔══██║██║     ██╔══██║██║██║╚██╗██║██╔══╝  ',
  '  ██║ ╚═╝ ██║██║  ██║╚██████╗██║  ██║██║██║ ╚████║███████╗',
  '  ╚═╝     ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚══════╝',
  '     >->__                  >>----------------------->    ',
]

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
  const sectionRef = useRef<HTMLDivElement>(null)
  const isVisible = useScrollReveal(sectionRef)
  const { reducedMotion } = useScrollRevealContext()
  const heroVisible = reducedMotion || isVisible

  // Cursor glow effect
  const cursorGlowRef = useCursorGlow({
    glowSize: 600,
    enabled: !reducedMotion,
  })

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
    <>
      {/* Full-screen cursor glow overlay - Blue theme */}
      {!reducedMotion && (
        <div
          ref={cursorGlowRef as any}
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(var(--glow-size, 600px) circle at var(--cursor-x, 50%) var(--cursor-y, 50%), rgba(107, 155, 209, 0.15), transparent 60%)',
            zIndex: 1,
          }}
        />
      )}

      <section
        ref={sectionRef}
        id="hero"
        aria-label="Hero command panel"
        className={cn(
          'hero-section',
          'relative mx-auto max-w-7xl content-visibility-hero',
          'px-6 pt-24 pb-16 min-h-screen flex items-center justify-center',
          heroVisible && 'is-visible'
        )}
        style={{ zIndex: 10 }}
      >
        {/* Geometric wireframe decorations */}
        <GeometricDecor />

        <div className="flex flex-col items-center gap-12 text-center w-full max-w-5xl">
          {/* Tagline - Clean sans-serif */}
          <div className="w-full max-w-sm">
            <p className="text-xs md:text-sm text-blue-200/90 tracking-[0.35em] uppercase font-light leading-relaxed">
              Orchestrate Without Limits.
            </p>
          </div>

          {/* ASCII Art Title - Container centered, text left-aligned */}
          <div className="space-y-6 flex flex-col items-center w-full">
            <div className="inline-block">
              {/* CODE ASCII */}
              <pre
                className="text-cyan-400 leading-[1.2] select-none whitespace-pre overflow-visible text-left"
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 'clamp(10px, 2.5vw, 20px)',
                  letterSpacing: '0',
                  wordSpacing: '0',
                }}
              >
                {CODE_TEXT.join('\n')}
              </pre>

              {/* MACHINE ASCII */}
              <pre
                className="text-cyan-400 leading-[1.2] select-none whitespace-pre overflow-visible text-left mt-6"
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 'clamp(10px, 2.5vw, 20px)',
                  letterSpacing: '0',
                  wordSpacing: '0',
                }}
              >
                {MACHINE_TEXT.join('\n')}
              </pre>
            </div>
          </div>

          {/* Command snippet - Simple elegant style */}
          <div className="flex flex-col gap-6 w-full max-w-2xl items-center mt-4">
            <div className="relative group w-full max-w-lg">
              {/* Cyan glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-cyan-400/40 to-cyan-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />

              {/* Command box - Transparent glass */}
              <div className="relative flex items-center justify-between px-5 py-3 bg-white/5 backdrop-blur-md border border-white/20 group-hover:border-cyan-400/60 rounded-xl shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  <span className="text-cyan-400 font-mono text-sm select-none">
                    $
                  </span>
                  <code
                    ref={commandRef}
                    className="font-mono text-sm text-white/90 bg-transparent border-none focus:ring-0 p-0 truncate select-all"
                    tabIndex={0}
                    role="textbox"
                    aria-label="Installation command"
                    aria-readonly="true"
                  >
                    {heroContent.installCommand}
                  </code>
                </div>
                {clipboardEnabled && (
                  <CopyButton status={status} onClick={copy} />
                )}
              </div>
            </div>

            {/* Documentation link - Simple */}
            <a
              href={heroContent.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDocsClick}
              className="inline-flex items-center gap-2 text-white/70 hover:text-cyan-400 text-sm transition-colors group/link"
            >
              <span>Documentation</span>
              <ExternalLink
                className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
