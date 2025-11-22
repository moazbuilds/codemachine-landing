/**
 * FooterCluster Component
 * Task: I3.T2 - Footer with external links and brand signature
 *
 * Semantic footer section containing:
 * - External links filtered for footer location (Docs, GitHub, Social)
 * - Brand signature/logo
 * - Glass card styling from Aura design system
 * - Responsive wrapping with centered alignment
 * - Analytics tracking for outbound clicks
 *
 * Uses NavLinks component for consistent link rendering and accessibility.
 * Integrates with trackEvent for telemetry.
 */

import { Terminal } from 'lucide-react'
import { externalLinks } from '@/content'
import type { ExternalLink } from '@/content'
import { trackEvent } from '@/lib/analytics'
import { NavLinks } from '@/components/NavigationBar/NavLinks'
import type { NavLinksVariant } from '@/components/NavigationBar/NavLinks'

export function FooterCluster() {
  const handleLinkClick = (link: ExternalLink, context: { variant: NavLinksVariant }) => {
    const eventName = link.analyticsEventName ?? 'external_link_click'

    trackEvent(eventName, {
      location: 'footer',
      surface: context.variant,
      label: link.label,
      url: link.href,
      icon: link.icon,
    })
  }

  return (
    <footer
      className="relative border-t border-white/10 glass-surface mt-auto"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      <div
        className="container mx-auto px-[var(--shell-padding-x)] py-12"
        style={{
          paddingTop: 'var(--shell-padding-y)',
          paddingBottom: 'var(--shell-padding-y)',
        }}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Brand Signature */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
                <Terminal
                  className="text-primary-400"
                  style={{ width: '24px', height: '24px' }}
                  aria-hidden="true"
                />
              </div>
              <span className="text-xl font-medium text-white">
                CodeMachine
              </span>
            </div>
            <p className="text-sm text-neutral-400 text-center max-w-md">
              AI-powered code generation for modern development workflows
            </p>
          </div>

          {/* Footer Links */}
          <nav
            className="flex flex-wrap items-center justify-center gap-6"
            aria-label="Footer navigation"
          >
            <NavLinks
              links={externalLinks}
              variant="footer"
              onLinkClick={handleLinkClick}
            />
          </nav>

          {/* Divider */}
          <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Copyright & Meta */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-neutral-500">
            <p>
              &copy; {new Date().getFullYear()} CodeMachine. All rights reserved.
            </p>
            <span className="hidden sm:inline" aria-hidden="true">
              •
            </span>
            <p>Built with React, Vite, and Aura Design System</p>
          </div>
        </div>
      </div>

      {/* Ambient glow at footer bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-primary-600/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
    </footer>
  )
}
