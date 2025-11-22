/**
 * ExperienceShell Component
 * Primary layout wrapper for the CodeMachine landing page.
 *
 * Architecture:
 * - Renders BackgroundLayers (noise, ambient glows) at the root level
 * - Wraps children with ScrollRevealProvider and FeatureFlagProvider contexts
 * - Mounts NavigationBar as sticky header
 * - Provides structured slots for hero, simulation, and future content sections
 *
 * Component Diagram Reference: docs/diagrams/component.md
 * Section 2 (Key Components/Services): Missing from repo - see code comments for layer boundaries
 * Section 5 (User Journeys): Missing from repo - see TODOs for user-flow expectations
 *
 * Future sections will inject into the children slot:
 * - HeroCommandPanel (I2.T2)
 * - VisualSimulationWindow (future iteration)
 * - FeatureBentoGrid (future iteration)
 * - IntegrationStatusBar (future iteration)
 */

import type { ReactNode } from 'react'
import { NavigationBar } from '@/components/NavigationBar'
import { FooterCluster } from '@/components/FooterCluster'
import { BackgroundLayers } from './BackgroundLayers'
import { ScrollRevealProvider } from './ScrollRevealContext'
import { FeatureFlagProvider } from './FeatureFlagContext'
import '@/styles/navigation.css'

interface ExperienceShellProps {
  children: ReactNode
}

export function ExperienceShell({ children }: ExperienceShellProps) {
  return (
    <FeatureFlagProvider>
      <ScrollRevealProvider>
        <div className="relative min-h-screen overflow-hidden flex flex-col">
          {/* CSS-only noise overlay using contain: paint to avoid reflow */}
          <div
            aria-hidden="true"
            className="bg-noise-pattern absolute inset-0"
            style={{
              opacity: 'var(--noise-opacity, 0.04)',
              zIndex: 'var(--z-background)',
            }}
          />
          {/* Background decorative layers (glows, gradients) */}
          <BackgroundLayers />

          {/* Sticky navigation bar */}
          <NavigationBar />

          {/* Main content area with responsive padding */}
          <main
            className="relative flex-1"
            style={{
              zIndex: 'var(--z-content)',
              paddingLeft: 'var(--shell-padding-x)',
              paddingRight: 'var(--shell-padding-x)',
              paddingTop: 'var(--shell-padding-y)',
              paddingBottom: 'var(--shell-padding-y)',
            }}
          >
            {/*
              TODO (Section 5 - User Journeys):
              User flow expectation:
              1. Land on hero with command prompt → Copy install command
              2. Scroll to simulation window → Watch live terminal demo
              3. Explore feature bento grid → Understand key capabilities
              4. Check integration status bar → See ecosystem compatibility
              5. Navigate to docs/GitHub via nav links → Learn more
            */}

            {/* Content sections will be injected here by App.tsx */}
            {children}

            {/*
              TODO (I2+): Add section slots with semantic HTML
              - <section id="hero" aria-label="Hero command panel">
              - <section id="simulation" aria-label="Visual simulation">
              - <section id="features" aria-label="Feature highlights">
              - <section id="integrations" aria-label="Integration status">
            */}
          </main>

          {/* Footer with external links and brand signature */}
          <FooterCluster />
        </div>
      </ScrollRevealProvider>
    </FeatureFlagProvider>
  )
}
