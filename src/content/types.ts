export type IconKey = 'sparkles' | 'zap' | 'terminal'

export type FeatureCard = {
  id: string
  title: string
  description: string
  icon: IconKey
  accent: 'primary' | 'emerald'
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
