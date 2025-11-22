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
import { Terminal, Menu, X } from 'lucide-react'
import { externalLinks } from '@/content'
import type { ExternalLink } from '@/content'
import { trackEvent } from '@/lib/analytics'
import { NavLinks } from './NavLinks'
import type { NavLinksVariant } from './NavLinks'

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const toggleButtonRef = useRef<HTMLButtonElement>(null)

  const focusToggleButton = useCallback(() => {
    if (!toggleButtonRef.current) return
    requestAnimationFrame(() => {
      toggleButtonRef.current?.focus()
    })
  }, [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev

      if (!next) {
        focusToggleButton()
      }

      return next
    })
  }, [focusToggleButton])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => {
      if (!prev) {
        return prev
      }

      focusToggleButton()
      return false
    })
  }, [focusToggleButton])

  const handleLinkClick = (link: ExternalLink, context: { variant: NavLinksVariant }) => {
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
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

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
        className="sticky top-0 glass-surface border-b border-white/10"
        style={{
          height: 'var(--shell-nav-height)',
          zIndex: 'var(--z-navigation)',
        }}
        aria-label="Primary"
      >
        <div className="container mx-auto px-[var(--shell-padding-x)] h-full flex items-center justify-between">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
              <Terminal
                className="text-primary-400"
                style={{ width: 'var(--nav-logo-size)', height: 'var(--nav-logo-size)' }}
                aria-hidden="true"
              />
            </div>
            <span className="text-lg font-medium text-white hidden sm:inline">
              CodeMachine
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks
              links={externalLinks}
              variant="desktop"
              onLinkClick={handleLinkClick}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            ref={toggleButtonRef}
            type="button"
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 focus-ring-aura"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer with Backdrop */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm md:hidden mobile-drawer-backdrop"
            style={{ zIndex: 'calc(var(--z-navigation) - 1)' }}
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
            className="fixed top-[var(--shell-nav-height)] right-0 w-72 max-w-[85vw] h-[calc(100vh-var(--shell-nav-height))] glass-surface border-l border-white/10 md:hidden mobile-drawer-panel"
            style={{ zIndex: 'var(--z-navigation)' }}
          >
            <div className="p-4 flex flex-col gap-2 h-full overflow-y-auto">
              <NavLinks
                links={externalLinks}
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
