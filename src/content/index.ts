import type {
  ExternalLink,
  FeatureCard,
  FeatureFlag,
  HeroContent,
  StarMetric,
  VisualAsset,
} from './types'

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
}

export const featureCards: FeatureCard[] = [
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
]

export const externalLinks: ExternalLink[] = [
  {
    label: 'GitHub Repo',
    href: 'https://github.com/moazbuilds/CodeMachine-CLI',
    description: 'Source of truth for the CodeMachine CLI and docs.',
  },
  {
    label: 'Design Spec',
    href: '/docs/diagrams/component.md',
    description: 'Planned component diagram for the ExperienceShell.',
  },
]

export const starMetrics: StarMetric[] = [
  { label: 'Framework', value: 'React 18' },
  { label: 'Build Tool', value: 'Vite 5' },
  { label: 'Theme', value: 'Aura Dark' },
]

export const featureFlags: FeatureFlag[] = [
  {
    key: 'enableGithubStars',
    description: 'Fetch GitHub stars for telemetry badge.',
    enabled: false,
  },
  {
    key: 'clipboardInteractions',
    description: 'Allow HeroCommandPanel copy-to-clipboard action.',
    enabled: false,
  },
]

export const visualAssets: VisualAsset[] = [
  {
    id: 'noise-texture',
    src: '/textures/noise.svg',
    alt: 'Subtle fractal noise texture',
    type: 'screenshot',
  },
]

export type {
  ExternalLink,
  FeatureCard,
  FeatureFlag,
  HeroContent,
  StarMetric,
  VisualAsset,
}
export type { IconKey } from './types'
