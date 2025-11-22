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

import { ExperienceShell } from '@/components/ExperienceShell'
import { HeroCommandPanel } from '@/components/HeroCommandPanel'
import { VisualSimulationWindow } from '@/components/VisualSimulationWindow'
import { FeatureBentoGrid } from '@/components/FeatureBentoGrid'
import { AIIntegrations } from '@/components/AIIntegrations'
import { EnterpriseContact } from '@/components/EnterpriseContact'
import '@/styles/hero.css'

function App() {

  return (
    <ExperienceShell>
      {/* Hero Section */}
      <HeroCommandPanel />

      {/* Simulation Window - Responsive */}
      <VisualSimulationWindow />

      {/* Feature Bento Grid */}
      <FeatureBentoGrid />

      {/* AI Integrations & Tech Stack */}
      <AIIntegrations />

      {/* Teams & Enterprise Contact */}
      <EnterpriseContact />
    </ExperienceShell>
  )
}

export default App
