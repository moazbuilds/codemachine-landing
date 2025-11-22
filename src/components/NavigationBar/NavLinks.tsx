/**
 * NavLinks Component
 * Task: I3.T2 - Reusable link renderer for navigation and footer
 *
 * Renders external links with:
 * - Location-based filtering (nav, footer, both)
 * - Variant-specific styling (desktop, mobile, footer)
 * - Dynamic icon loading from Lucide
 * - Consistent accessibility attributes
 * - Analytics event tracking
 *
 * Used by:
 * - NavigationBar (desktop + mobile variants)
 * - FooterCluster (footer variant)
 */

import type { ComponentType } from 'react'
import * as LucideIcons from 'lucide-react'
import type { ExternalLink, ExternalLinkLocation } from '@/content'

export type NavLinksVariant = 'desktop' | 'mobile' | 'footer'

interface NavLinksProps {
  links: readonly ExternalLink[]
  variant: NavLinksVariant
  onLinkClick?: (link: ExternalLink, context: { variant: NavLinksVariant }) => void
}

/**
 * Resolve Lucide icon component by name string
 * Returns ExternalLink icon as fallback if icon not found
 */
type LucideIconComponent = ComponentType<Record<string, unknown>>

function getLucideIcon(iconName?: string): LucideIconComponent {
  if (!iconName) {
    return LucideIcons.ExternalLink
  }

  const iconRegistry = LucideIcons as unknown as Record<
    string,
    LucideIconComponent | undefined
  >
  const Icon = iconRegistry[iconName]
  return Icon || LucideIcons.ExternalLink
}

/**
 * Filter links by location field
 * Matches if location array includes the variant or 'both'
 */
function filterLinksByLocation(
  links: readonly ExternalLink[],
  variant: NavLinksVariant
): readonly ExternalLink[] {
  const locationFilter: ExternalLinkLocation =
    variant === 'footer' ? 'footer' : 'nav'

  return links.filter((link) => {
    return (
      link.location.includes(locationFilter) || link.location.includes('both')
    )
  })
}

/**
 * Get variant-specific CSS classes for link containers
 */
function getVariantClasses(variant: NavLinksVariant): string {
  const baseClasses =
    'flex items-center gap-2 text-neutral-400 hover:text-white transition-colors focus-ring-aura rounded'

  switch (variant) {
    case 'desktop':
      return `${baseClasses} text-xs font-medium`

    case 'mobile':
      return `${baseClasses} justify-between px-4 py-3 hover:bg-white/5 text-sm font-medium min-h-[48px]`

    case 'footer':
      return `${baseClasses} text-xs`

    default:
      return baseClasses
  }
}

/**
 * Get icon size based on variant
 */
function getIconSize(variant: NavLinksVariant): string {
  switch (variant) {
    case 'desktop':
      return 'w-3.5 h-3.5'
    case 'mobile':
      return 'w-5 h-5'
    case 'footer':
      return 'w-4 h-4'
    default:
      return 'w-4 h-4'
  }
}

export function NavLinks({ links, variant, onLinkClick }: NavLinksProps) {
  const filteredLinks = filterLinksByLocation(links, variant)
  const variantClasses = getVariantClasses(variant)
  const iconSize = getIconSize(variant)

  if (filteredLinks.length === 0) {
    return null
  }

  return (
    <>
      {filteredLinks.map((link) => {
        const Icon = getLucideIcon(link.icon)
        const ariaLabel = link.ariaLabel || link.description || link.label

        return (
          <a
            key={link.label}
            href={link.href}
            target={link.newTab ? '_blank' : undefined}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
            onClick={() => onLinkClick?.(link, { variant })}
            className={variantClasses}
            aria-label={ariaLabel}
          >
            <span>{link.label}</span>
            <Icon className={iconSize} aria-hidden="true" />
          </a>
        )
      })}
    </>
  )
}
