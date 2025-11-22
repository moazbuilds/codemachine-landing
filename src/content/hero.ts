// Diagram: Data Model ERD (I1.T2)
// Hero content module - provides typed hero section copy

import type { HeroContent } from './types'

/**
 * Hero section content for the landing page.
 * Includes title, kicker, description, CTA labels, and telemetry copy.
 */
export const heroContent: HeroContent = {
  title: 'CodeMachine',
  kicker: 'Autonomous Dev Agents',
  description:
    'This workspace ships with a React 18 + Vite baseline, Tailwind Aura theming, and content scaffolding so future agents can focus on product features instead of setup.',
  ctas: {
    primary: 'Get Started',
    secondary: 'Learn More',
  },
  telemetryLabel: 'Build Status: Ready • Framework: React 18 • Bundler: Vite',
  installCommand: 'npm install -g codemachine-cli',
  startCommand: 'codemachine init',
  betaLabel: 'Beta',
  docsUrl: 'https://docs.codemachine.co',
} as const
