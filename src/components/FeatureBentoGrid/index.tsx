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
      className="mx-auto max-w-7xl px-6 py-16 md:py-24 content-visibility-bento"
    >
      {/* Section heading */}
      <div className="mb-12 flex flex-col gap-4">
        <h2
          id="features-heading"
          className="heading-hero text-gradient-primary"
        >
          Features
        </h2>
        <p className="max-w-2xl text-lg text-neutral-400">
          Built with modern tools and patterns for a seamless developer experience.
        </p>
      </div>

      {/* Bento grid layout with isolated grid background */}
      <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-neutral-950/40 p-6">
        <div
          aria-hidden="true"
          className="bg-grid-pattern absolute inset-0 opacity-40"
        />
        <div
          className="
            bento-grid
            relative
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            lg:grid-cols-3
            lg:gap-6
          "
          role="list"
        >
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
