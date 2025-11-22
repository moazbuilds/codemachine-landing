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
      className="py-12 mt-auto relative z-10"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>

      {/* Separator line - same as nav */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        {/* Footer Links - Centered, Responsive */}
        <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
          <NavLinks
            links={externalLinks}
            variant="footer"
            onLinkClick={handleLinkClick}
          />
        </div>
      </div>
    </footer>
  )
}
