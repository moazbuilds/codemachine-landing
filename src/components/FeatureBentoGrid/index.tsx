/**
 * FeatureBentoGrid - Responsive grid of feature cards
 * Task: I3.T1 - FeatureBentoGrid Implementation
 *
 * Implements:
 * - Responsive bento layout (grid on desktop, stack on mobile)
 * - Grid span configuration via FeatureCard data
 * - ScrollReveal integration for fade-up animations
 * - Performance-optimized rendering (<16ms per frame)
 * - Accessibility semantics with proper ARIA
 *
 * Architecture:
 * - Consumes featureCards from content config
 * - Uses ScrollRevealProvider context for animations
 * - Applies Aura design tokens for consistent theming
 * - Maintains semantic HTML structure
 *
 * Journey 2: Feature Exploration
 * - IntersectionObserver triggers fade-in on scroll
 * - Hover states show inner glow + ring effects
 * - Touch devices use tap toggles instead of hover
 */

import { featureCards } from '@/content'
import { FeatureCard } from './FeatureCard'
import '@/styles/bento.css'

export function FeatureBentoGrid() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative z-10 py-24"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading - Aura Style */}
        <div className="flex flex-col mb-16 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2 tracking-tight">
              Engineered for Velocity
            </h2>
            <p className="text-neutral-500 text-sm max-w-md">
              A complete engine for software generation, built to handle complexity without breaking.
            </p>
          </div>
        </div>

        {/* Grid - Aura Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featureCards.map((card, index) => (
            <FeatureCard
              key={card.id}
              card={card}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
