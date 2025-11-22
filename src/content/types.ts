import type { EventName } from '@/lib/analytics'

export type IconKey = 'sparkles' | 'zap' | 'terminal' | 'cpu' | 'file-code' | 'clock' | 'shield-check' | 'rocket'

export type ExternalLinkLocation = 'nav' | 'footer' | 'both'

export type FeatureCard = {
  id: string
  title: string
  description: string
  icon: IconKey
  accent: 'primary' | 'emerald' | 'amber' | 'blue' | 'green' | 'purple'
  gridSpan?: {
    desktop?: string
    mobile?: string
  }
  accentGlow?: boolean
  ctaLabel?: string
}

export type HeroContent = {
  title: string
  kicker: string
  description: string
  ctas: {
    primary: string
    secondary: string
  }
  telemetryLabel: string
  installCommand: string
  startCommand?: string
  betaLabel?: string
  docsUrl: string
}

export type ExternalLink = {
  label: string
  href: string
  description?: string
  icon?: string // Lucide icon name
  ariaLabel?: string
  location: ExternalLinkLocation[]
  newTab: boolean
  analyticsEventName?: EventName
}

export type StarMetric = {
  label: string
  value: string
}

export type VisualAsset = {
  id: string
  src: string
  alt: string
  type: 'screenshot' | 'diagram' | 'video'
}

export type FeatureFlag = {
  key: string
  description: string
  enabled: boolean
}
