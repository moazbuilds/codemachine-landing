export type IconKey = 'sparkles' | 'zap' | 'terminal'

export type FeatureCard = {
  id: string
  title: string
  description: string
  icon: IconKey
  accent: 'primary' | 'emerald'
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
