// Diagram: Data Model ERD (I1.T2)
// Feature cards module - provides typed feature content and visual assets

import type { FeatureCard, VisualAsset } from './types'

/**
 * Feature cards displayed on the landing page.
 * Each card includes an icon, title, description, and accent color.
 */
export const featureCards: readonly FeatureCard[] = [
  {
    id: 'multi-agent-orchestration',
    title: 'Multi-Agent Orchestration',
    description:
      'Coordinate heterogeneous AI models across specialized tasks. Each agent handles what it does best, working in parallel for maximum efficiency.',
    icon: 'cpu',
    accent: 'primary',
    accentGlow: true,
    gridSpan: {
      desktop: 'lg:col-span-2',
      mobile: 'col-span-1',
    },
  },
  {
    id: 'spec-to-code',
    title: 'Spec-to-Code Transformation',
    description: 'Convert specifications into production-ready software. Write what you want, CodeMachine builds it autonomously.',
    icon: 'file-code',
    accent: 'emerald',
    accentGlow: true,
    gridSpan: {
      desktop: 'lg:col-span-1',
      mobile: 'col-span-1',
    },
  },
  {
    id: 'parallel-execution',
    title: 'Parallel Execution',
    description: 'Sub-agents process different components simultaneously. What takes hours manually happens in minutes.',
    icon: 'zap',
    accent: 'amber',
    accentGlow: true,
    gridSpan: {
      desktop: 'lg:col-span-1',
      mobile: 'col-span-1',
    },
  },
  {
    id: 'long-running-workflows',
    title: 'Long-Running Workflows',
    description: 'Support for extended execution spanning hours or days. Perfect for complex development goals and large-scale projects.',
    icon: 'clock',
    accent: 'blue',
    accentGlow: true,
    gridSpan: {
      desktop: 'lg:col-span-2',
      mobile: 'col-span-1',
    },
  },
  {
    id: 'validated-output',
    title: 'Automated Validation',
    description: 'Built-in sanity checks across all execution phases. Catch issues early with autonomous quality assurance.',
    icon: 'shield-check',
    accent: 'green',
    accentGlow: true,
    gridSpan: {
      desktop: 'lg:col-span-1',
      mobile: 'col-span-1',
    },
  },
  {
    id: 'proven-production',
    title: 'Production-Proven',
    description: '90% of CodeMachine was built by itself. Validated on real projects: 7 microservices, 60,000+ lines of code, 8 hours of autonomous work.',
    icon: 'rocket',
    accent: 'purple',
    accentGlow: true,
    gridSpan: {
      desktop: 'lg:col-span-2',
      mobile: 'col-span-1',
    },
  },
] as const

/**
 * Visual assets used throughout the application.
 * Includes textures, screenshots, diagrams, and videos.
 */
export const visualAssets: readonly VisualAsset[] = [
  {
    id: 'noise-texture',
    src: '/textures/noise.svg',
    alt: 'Subtle fractal noise texture',
    type: 'screenshot',
  },
] as const
