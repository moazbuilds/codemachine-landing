/**
 * NavigationBar Component
 * Task: I3.T2 - Sticky navigation with responsive drawer and analytics
 *
 * Sticky navigation bar with:
 * - CodeMachine logo/branding
 * - External navigation links (Docs, GitHub) from @/content/links
 * - Mobile-responsive drawer with focus trap and ARIA state
 * - Analytics tracking for all outbound clicks
 *
 * Features:
 * - Location-filtered links via NavLinks component
 * - Focus trap when mobile drawer open
 * - Escape key to close drawer
 * - Backdrop click to close
 * - Smooth animations respecting prefers-reduced-motion
 *
 * Design tokens from src/styles/navigation.css control animations.
 */

import { useCallback, useState, useEffect, useRef } from 'react'
import { externalLinks } from '@/content'
import type { ExternalLink } from '@/content'
import { trackEvent } from '@/lib/analytics'
import { NavLinks } from './NavLinks'
import type { NavLinksVariant } from './NavLinks'
import { GitHubStars } from './GitHubStars'

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  // Find GitHub link from external links
  const githubLink = externalLinks.find(link => link.label === 'GitHub')

  // Filter only social links (Twitter, Discord, Reddit) for navigation
  const socialLinks = externalLinks.filter(link =>
    ['Twitter', 'Discord', 'Reddit'].includes(link.label)
  )

  const focusToggleButton = useCallback(() => {
    if (!toggleButtonRef.current) return
    requestAnimationFrame(() => {
      toggleButtonRef.current?.focus()
    })
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      if (!prev) {
        return prev
      }

      focusToggleButton()
      return false
    })
  }, [focusToggleButton])

  const handleLinkClick = (
    link: ExternalLink,
    context: { variant: NavLinksVariant }
  ) => {
    const eventName = link.analyticsEventName ?? 'external_link_click'

    trackEvent(eventName, {
      location: 'header',
      surface: context.variant,
      label: link.label,
      url: link.href,
      icon: link.icon,
    })

    if (context.variant === 'mobile') {
      closeMobileMenu()
    }
  }

  // Focus trap: when drawer opens, focus first link; on close, return to toggle button
  useEffect(() => {
    if (isMobileMenuOpen && drawerRef.current) {
      const firstFocusable = drawerRef.current.querySelector(
        'a, button'
      ) as HTMLElement
      firstFocusable?.focus()
    }
  }, [isMobileMenuOpen])

  // Escape key handler to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isMobileMenuOpen, closeMobileMenu])

  // Tab trap: constrain focus within drawer when open
  useEffect(() => {
    if (!isMobileMenuOpen || !drawerRef.current) return

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const focusableElements = drawerRef.current?.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusableElements || focusableElements.length === 0) return

      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleTabTrap)
    return () => document.removeEventListener('keydown', handleTabTrap)
  }, [isMobileMenuOpen])

  return (
    <>
      <nav
        className="relative w-full"
        style={{
          height: 'var(--shell-nav-height, 56px)',
        }}
        aria-label="Primary"
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-center gap-8">
          {/* Centered Navigation - Social Links + GitHub Stars */}
          <div className="flex items-center gap-8">
            {/* Desktop Social Links - Twitter, Discord, Reddit */}
            <div className="hidden md:flex items-center gap-6">
              <NavLinks
                links={socialLinks}
                variant="desktop"
                onLinkClick={handleLinkClick}
              />
            </div>

            {githubLink && (
              <GitHubStars repoUrl={githubLink.href} />
            )}
          </div>
        </div>

        {/* Split line under navigation */}
        <hr
          className="absolute bottom-0 w-full h-px left-1/2 -translate-x-1/2 border-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 52.07%, rgba(255, 255, 255, 0) 100%)'
          }}
        />
      </nav>

      {/* Mobile Drawer with Backdrop */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm md:hidden mobile-drawer-backdrop"
            style={{ zIndex: 999 }}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div
            id="mobile-nav-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className="fixed top-0 right-0 w-72 max-w-[85vw] h-full md:hidden mobile-drawer-panel"
            style={{
              zIndex: 1000,
              background: 'linear-gradient(to bottom, var(--bg-base-start), var(--bg-base-end))'
            }}
          >
            <div className="p-4 flex flex-col gap-2 h-full overflow-y-auto">
              {/* GitHub Stars Badge in mobile */}
              {githubLink && (
                <div className="mb-4">
                  <GitHubStars repoUrl={githubLink.href} className="w-full justify-center" />
                </div>
              )}

              <NavLinks
                links={socialLinks}
                variant="mobile"
                onLinkClick={handleLinkClick}
              />

              {/* Close button for accessibility */}
              <button
                type="button"
                onClick={closeMobileMenu}
                className="mt-auto px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus-ring-aura text-sm font-medium"
                aria-label="Close navigation menu"
              >
                Close Menu
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
