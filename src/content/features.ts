// Diagram: Data Model ERD (I1.T2)
// Feature cards module - provides typed feature content and visual assets

import type { FeatureCard, VisualAsset } from './types'

/**
 * Feature cards displayed on the landing page.
 * Each card includes an icon, title, description, and accent color.
 */
export const featureCards: readonly FeatureCard[] = [
  {
    id: 'aura-theme',
    title: 'Aura Theme',
    description:
      'Dark palette with glass surfaces, ambient glows, and accessible focus states baked into Tailwind utilities.',
    icon: 'sparkles',
    accent: 'primary',
  },
  {
    id: 'lucide-icons',
    title: 'Lucide Icons',
    description: 'Tree-shakeable icon system ready for telemetry badges and command palettes.',
    icon: 'zap',
    accent: 'emerald',
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
