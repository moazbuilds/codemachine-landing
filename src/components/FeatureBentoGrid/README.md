# FeatureBentoGrid

**Status:** ✅ Live Implementation (I3.T1)

Responsive grid component displaying feature cards with glass morphism effects, hover animations, and scroll-triggered reveals.

## Components

### `FeatureBentoGrid` (index.tsx)
Main grid container that:
- Renders feature cards in responsive bento layout
- Provides section semantics with proper ARIA labels
- Switches between desktop grid (3 columns) and mobile stack (1 column)
- Integrates with ScrollRevealProvider for animation orchestration

### `FeatureCard` (FeatureCard.tsx)
Individual card component that:
- Displays icon, title, and description from content config
- Implements hover states with inner glow and ring effects
- Registers with ScrollReveal for fade-up animations
- Supports custom grid spans via Tailwind utility classes defined in content config
- Provides accessibility via semantic HTML and ARIA
- Enables tap-to-toggle glows on touch devices via `data-tap-active`

## Styling

**File:** `src/styles/bento.css`

Provides:
- Fade-up animations triggered by IntersectionObserver
- Hover/focus states with glass effects and glows
- Responsive breakpoints (mobile stack, tablet 2-col, desktop 3-col)
- Reduced-motion support (WCAG 2.1 AA)
- Touch device fallbacks (tap instead of hover)
- Print and high-contrast mode optimizations
- GPU-accelerated transforms for performance

## Data Contract

**Type:** `FeatureCard` (src/content/types.ts)

```typescript
{
  id: string
  title: string
  description: string
  icon: IconKey ('sparkles' | 'zap' | 'terminal')
  accent: 'primary' | 'emerald'
  gridSpan?: {
    desktop?: string  // e.g., 'lg:col-span-2'
    mobile?: string   // e.g., 'col-span-1'
  }
  accentGlow?: boolean
  ctaLabel?: string
}
```

## Performance

- Single IntersectionObserver shared via context (O(1) vs O(n))
- CSS-only animations with GPU acceleration
- will-change hints removed after animation completes
- Paint containment on grid container
- Meets <16ms per frame budget

## Accessibility

- Semantic HTML (`<section>`, `<article>`, headings)
- ARIA labels and describedby relationships
- Keyboard navigation with visible focus states
- prefers-reduced-motion support
- Touch-friendly targets and tap states
- Color contrast compliance (WCAG AA)

## Usage

```tsx
import { FeatureBentoGrid } from '@/components/FeatureBentoGrid'

<FeatureBentoGrid />
```

The component automatically consumes `featureCards` from `@/content` and renders them according to the configured layout.
