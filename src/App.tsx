/**
 * App Component
 * Main application entry point - orchestrates ExperienceShell and child sections.
 *
 * Architecture (I1.T3):
 * - Wraps all content in ExperienceShell (provides layout, contexts, navigation)
 * - Renders structural placeholders for future hero/simulation/feature sections
 * - References typed content modules so data contracts stay connected
 *
 * Providers initialized by ExperienceShell:
 * - FeatureFlagProvider (seeded from @/content/featureFlags)
 * - ScrollRevealProvider (placeholder for scroll-based animation orchestration)
 */

import { useEffect } from 'react'
import {
  featureCards,
  heroContent,
  starMetrics,
  visualAssets,
} from '@/content'
import { ExperienceShell } from '@/components/ExperienceShell'

type ShellSection = {
  id: string
  label: string
  status: string
  description: string
  detail: string
}

const featureCardSummary = featureCards.map((card) => card.title).join(', ')
const telemetrySummary = starMetrics
  .map((metric) => `${metric.label}: ${metric.value}`)
  .join(' • ')
const primaryVisualAsset = visualAssets[0]

const shellSections: readonly ShellSection[] = [
  {
    id: 'hero',
    label: 'HeroCommandPanel',
    status: 'Planned: I2.T2',
    description: heroContent.description,
    detail: `CTA copy ready: ${heroContent.ctas.primary} / ${heroContent.ctas.secondary}`,
  },
  {
    id: 'simulation',
    label: 'VisualSimulationWindow',
    status: 'Design pass pending',
    description:
      'Live terminal simulation will mirror Hero command interactions and telemetry states.',
    detail: primaryVisualAsset
      ? `Primary asset prepared: ${primaryVisualAsset.alt}`
      : 'Visual assets pending import',
  },
  {
    id: 'features',
    label: 'FeatureBentoGrid',
    status: 'Awaiting layout implementation',
    description: `${featureCards.length} typed feature cards are ready for rendering.`,
    detail: `Cards: ${featureCardSummary}`,
  },
  {
    id: 'integrations',
    label: 'IntegrationStatusBar',
    status: 'Telemetry wiring pending',
    description:
      'Integration badges will surface build, framework, and theme readiness.',
    detail: `Telemetry seeds: ${telemetrySummary}`,
  },
]

function App() {
  useEffect(() => {
    console.log(
      '[Analytics Stub] ExperienceShell sections pending render:',
      shellSections.map((section) => section.id)
    )
  }, [])

  return (
    <ExperienceShell>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 py-10">
        {shellSections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-label={`${section.label} placeholder`}
            className="glass-surface rounded-2xl border border-white/5 px-6 py-5 shadow-lg shadow-black/20"
          >
            <div className="flex flex-col gap-2">
              <p className="label-telemetry text-neutral-500">{section.status}</p>
              <div className="flex flex-col gap-1">
                <h2 className="heading-section text-gradient-primary">
                  {section.label}
                </h2>
                <p className="text-sm text-neutral-400">{section.description}</p>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-400">
                {section.detail}
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-dashed border-white/10 px-4 py-3 text-sm text-neutral-500">
              TODO: Mount <code className="text-primary-300">{section.label}</code>{' '}
              component once implemented.
            </div>
          </section>
        ))}
      </div>
    </ExperienceShell>
  )
}

export default App
