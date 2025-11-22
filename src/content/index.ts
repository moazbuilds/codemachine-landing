// Diagram: Data Model ERD (I1.T2)
// Content barrel - centralizes all typed content exports

// Re-export hero content
export { heroContent } from './hero'

// Re-export feature content and visual assets
export { featureCards, visualAssets } from './features'

// Re-export external links, star metrics, and GitHub helpers
export { externalLinks, starMetrics, buildFallbackStarCopy } from './links'

// Re-export feature flags and helpers
export { featureFlags, isFeatureEnabled } from './flags'

// Re-export all types
export type {
  ExternalLink,
  FeatureCard,
  FeatureFlag,
  HeroContent,
  IconKey,
  StarMetric,
  VisualAsset,
} from './types'
