/**
 * NavigationBar Component
 * Referenced by: src/components/ExperienceShell/index.tsx:*
 *
 * Sticky navigation bar with:
 * - CodeMachine logo/branding
 * - External navigation links (Docs, GitHub) from @/content/links
 * - Mobile-responsive hamburger menu (toggleable, static for now)
 * - Analytics instrumentation stubs for outbound link tracking
 *
 * Uses externalLinks from @/content module to populate navigation items.
 * Design tokens from src/styles/tokens.css control spacing and colors.
 */

import { useState } from 'react'
import { Terminal, ExternalLink as ExternalLinkIcon, Menu, X } from 'lucide-react'
import { externalLinks } from '@/content'
import type { ExternalLink } from '@/content'

export function NavigationBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLinkClick = (link: ExternalLink) => {
    // TODO (I2+): Integrate analytics logging for outbound navigation
    console.log('[Analytics Stub] Outbound link clicked:', link.label, link.href)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  return (
    <nav
      className="sticky top-0 glass-surface border-b border-white/10"
      style={{
        height: 'var(--shell-nav-height)',
        zIndex: 'var(--z-navigation)',
      }}
    >
      <div className="container mx-auto px-[var(--shell-padding-x)] h-full flex items-center justify-between">
        {/* Logo / Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20">
            <Terminal
              className="text-primary-400"
              style={{ width: 'var(--nav-logo-size)', height: 'var(--nav-logo-size)' }}
            />
          </div>
          <span className="text-lg font-medium text-white hidden sm:inline">
            CodeMachine
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          {externalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link)}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors focus-ring-aura rounded px-3 py-2 hover:bg-white/5"
              aria-label={link.description || link.label}
            >
              <span className="text-sm font-medium">{link.label}</span>
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 focus-ring-aura"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-surface border-t border-white/10">
          <div className="container mx-auto px-[var(--shell-padding-x)] py-4 flex flex-col gap-2">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  handleLinkClick(link)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors focus-ring-aura"
                aria-label={link.description || link.label}
              >
                <span className="text-sm font-medium">{link.label}</span>
                <ExternalLinkIcon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
