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
    'CLI-native orchestration engine that runs coordinated multi-agent workflows directly on your local machine. Transform specifications into production-ready software with autonomous AI agents.',
  ctas: {
    primary: 'Get Started',
    secondary: 'Learn More',
  },
  telemetryLabel: '25-37× Faster • Multi-Agent Orchestration • Production-Ready',
  installCommand: 'npm install -g codemachine',
  startCommand: 'codemachine init',
  betaLabel: 'Beta',
  docsUrl: 'https://docs.codemachine.co',
} as const
