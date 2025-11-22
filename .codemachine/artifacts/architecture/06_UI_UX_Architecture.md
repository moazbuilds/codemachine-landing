<!-- anchor: ui-ux-architecture -->
# UI/UX Architecture: CodeMachine Landing Page
**Status:** UI_REQUIRED

A premium Aura-themed landing page built with React 18 + Vite communicates the CodeMachine CLI value proposition through a hero, glassmorphic simulation, feature bento grid, and integration-focused footer. Architecture emphasizes deterministic content configs, micro-interactions for clipboard and hover states, and resilient fallbacks for GitHub metrics.

<!-- anchor: 1-design-system-specification -->
## 1. Design System Specification

The Aura visual language governs every surface: true-neutral backgrounds, indigo accents, glassmorphic depth, and subtle noise/grids layered globally via `ExperienceShell`.

<!-- anchor: 1-1-color-palette -->
### 1.1. Color Palette

| Token | Value | Usage |
| --- | --- | --- |
| `bg-base` | `#020202` to `#050505` gradient | Page root background blending with ambient glows and noise overlay.
| `neutral-950` | `#000000` | Hero and footer foundation; ensures high contrast with white text.
| `neutral-900` | `#0a0a0a` | Glass cards interior surfaces and Mac-window shell.
| `neutral-700` | `#404040` | Borders, dividers, subtle grid lines.
| `primary-400` | `#a78bfa` | Accent text, copy confirmation, active indicators.
| `primary-500` | `#8b5cf6` | CTA gradients, active tab bars, telemetry highlights.
| `primary-600` | `#7c3aed` | Ambient glow blobs, focus rings, hero gradient strokes.
| `blue-500` | `#3b82f6` | Secondary accent for gradients and telemetry data.
| `emerald-400` | `#34d399` | Status indicators for active agents.
| `error-500` | `#f87171` | Clipboard failure or fetch warnings.
| `glass-border` | `rgba(255,255,255,0.08)` | Standard outline for glass surfaces.

All colors are exposed via Tailwind config extensions and referenced through semantic CSS variables for consistency between React components and any future CMS inputs.

<!-- anchor: 1-2-typography -->
### 1.2. Typography

- **Primary Sans:** `Inter` with weights 300–700, tight tracking on headings via `tracking-tighter`.
- **Monospace:** `JetBrains Mono` for code, telemetry, and navigation metadata.
- **Type Scale:** `xs (12px)`, `sm (14px)`, `base (16px)`, `lg (18px)`, `xl (20px)`, `2xl (24px)`, `3xl (30px)`, `4xl (36px)`, `5xl (48px)`, `6xl (60px)`, `7xl (72px)` mapped to Tailwind utilities.
- **Line Heights:** `1.1` for hero headings, `1.4` for body copy, `1.6` for paragraphs longer than three lines, ensuring readability on dark backgrounds.
- **Text Treatments:** `text-glow` utility for standout stat lines, `uppercase tracking-[0.2em]` for telemetry labels, `font-light` for long-form descriptions to maintain premium tone.

<!-- anchor: 1-3-spacing-and-sizing -->
### 1.3. Spacing & Sizing

- **Base Grid:** 4px increments represented as Tailwind spacing scale; hero uses multiples of 12px to align with noise/grid texture.
- **Section Padding:** `pt-32 pb-20` for hero, `py-24` for feature section, `py-12` for footer; reduce by 25% below `md` breakpoints.
- **Content Widths:** `max-w-7xl` for global wrappers, `max-w-5xl` for simulation window, `max-w-md` for CTA cluster.
- **Card Radii:** `rounded-xl` (24px) for major panels, `rounded-lg` (16px) for buttons/badges, `rounded-full` for pill chips and glow nodes.
- **Elevation Tokens:** Depth increases through layered box-shadows + background gradients rather than z-index stacking to maintain GPU efficiency.

<!-- anchor: 1-4-component-tokens -->
### 1.4. Component Tokens

- `glass-card`: shared Tailwind class macro applying translucent background, `backdrop-blur-xl`, `border-white/10`, and drop shadow.
- `ambient-glow`: absolutely positioned `div` with `blur-[120px]` and blend modes to create Aura halos.
- `noise-overlay`: fixed SVG data texture with `opacity-3%` to add grain without kurtosis.
- `focus-ring`: `ring-2 ring-primary-500/60 ring-offset-2 ring-offset-neutral-950` applied via `focus-visible` to all interactive elements.
- `inner-glow`: combination of `ring-1 ring-white/10` plus `shadow-[inset_0_1px_12px_rgba(255,255,255,0.07)]` for hover states on cards.
- Animation tokens: `fade-up` (0.3s ease-out, 20px translate), `pulse-slow` (4s), `shimmer` (2s linear) triggered through IntersectionObserver hooks.

<!-- anchor: 2-component-architecture -->
## 2. Component Architecture

The interface follows a composable, data-driven structure where `ContentConfigModule` exports typed entities consumed by presentation components. Prop contracts enforce Aura theming consistency and allow localized micro-interactions without re-rendering the entire page.

<!-- anchor: 2-1-overview -->
### 2.1. Overview

- **Methodology:** Hybrid Atomic Design. Atoms (buttons, badges) compose molecules (HeroCommandPanel, StarBadge) which feed organisms (ExperienceShell, FeatureBentoGrid).
- **Data Flow:** Config modules deliver content via props; feature flags toggle experimental UI variants at build time.
- **Interactivity Hooks:** Clipboard + GitHub fetch implemented as reusable hooks (`useClipboardCommand`, `useGitHubStars`) to elevate reliability and logging.
- **Progressive Enhancement:** Static markup renders core narrative; JS enhances animations, copy feedback, and star counts when APIs are available.

<!-- anchor: 2-2-core-component-spec -->
### 2.2. Core Component Specification

| Component | Description | Key Props / Data | Accessibility & Behavior |
| --- | --- | --- | --- |
| `ExperienceShell` | Wraps layout, background noise, ambient glows, and sticky nav; injects fonts and Tailwind context. | `visualAssets: VisualAsset[]`, `children` | Ensures semantic landmarks (`<header>`, `<main>`, `<footer>`), locks background layers with `aria-hidden="true"`.
| `NavigationBar` | Displays logo, anchor links, GitHub badge, responsive menu trigger. | `links: ExternalLink[]`, `starMetric?: StarMetric` | Uses `<nav>` role, `aria-label="Primary"`, focus trap for mobile drawer.
| `HeroCommandPanel` | Hero copy and install command with copy CTA and docs button. | `content: HeroContent`, `onCopy(event)` | Copy button exposes `aria-live="polite"` confirmation; handles clipboard fallback by selecting text when `navigator.clipboard` unavailable.
| `VisualSimulationWindow` | Glass terminal simulation showcasing agent status + telemetry. | `panes`, `status`, `isMobile` | Collapses to static image or simplified card below `md`; uses `<figure>` with descriptive `<figcaption>` for screen readers.
| `FeatureBentoGrid` | Responsive grid of glass cards describing value props. | `features: FeatureCard[]` | Cards are `<article>` elements with `aria-describedby`; hover states degrade gracefully on touch devices by enabling tap toggles.
| `IntegrationStatusBar` | Fetches GitHub star count, handles retries, caching, fallback. | `repo`, `fallbackLabel`, `cacheHours` | Announces metrics through `aria-live` only when value changes, logs successes/failures via `console.info/warn`.
| `FooterCluster` | Social links, docs link, brand signature. | `links: ExternalLink[]` | Includes skip-link anchor target for keyboard navigation.
| `ScrollRevealProvider` | IntersectionObserver wrapper applying `data-visible` attributes for CSS transitions. | `threshold`, `rootMargin`, `children` | Avoids animation for users with `prefers-reduced-motion`.

<!-- anchor: 2-3-component-hierarchy -->
### 2.3. Component Hierarchy Diagram (PlantUML)

~~~plantuml
@startuml
skinparam componentStyle rectangle
package "ExperienceShell" {
  [NavigationBar] --> [HeroCommandPanel]
  [NavigationBar] --> [IntegrationStatusBar]
  [HeroCommandPanel] --> [VisualSimulationWindow]
  [HeroCommandPanel] --> [ScrollRevealProvider]
  [ScrollRevealProvider] --> [FeatureBentoGrid]
  [FeatureBentoGrid] --> [FeatureCard xN]
  [IntegrationStatusBar] --> [StarBadge]
  [ExperienceShell] --> [FooterCluster]
  [FooterCluster] --> [ExternalLink]
}
note right of [IntegrationStatusBar]
  useGitHubStars hook + cache
end note
note left of [HeroCommandPanel]
  useClipboardCommand hook
end note
@enduml
~~~

<!-- anchor: 3-application-structure -->
## 3. Application Structure & User Flows

A single-page route hosts all content; navigational anchors handle intra-page motion with smooth scrolling and sticky navigation.

<!-- anchor: 3-1-route-definitions -->
### 3.1. Route Definitions

| Route | Component Stack | Content | Interactions |
| --- | --- | --- | --- |
| `/` | `ExperienceShell > NavigationBar > HeroCommandPanel > VisualSimulationWindow > FeatureBentoGrid > FooterCluster` | CodeMachine CLI overview, doc link, glass simulation, bento features, social links. | Copy command, doc/GitHub outbound links, responsive simulation toggle, scroll reveals, star fetch. |

Anchor links (`#features`) scroll to the bento section; nav buttons open docs/GitHub in new tabs with `rel="noopener noreferrer"`.

<!-- anchor: 3-2-critical-user-journeys -->
### 3.2. Critical User Journeys (PlantUML)

~~~plantuml
@startuml
skinparam ArrowColor #8b5cf6
actor User
participant "ExperienceShell" as Shell
participant "HeroCommandPanel" as Hero
participant "VisualSimulationWindow" as Sim
participant "FeatureBentoGrid" as Bento
participant "IntegrationStatusBar" as Stars
participant "Docs/GitHub Link" as External
== Journey 1: Installation ==
User -> Hero : Load page
Hero -> Shell : trigger fade-in animation
User -> Hero : Click copy icon
Hero -> Hero : try navigator.clipboard.writeText()
Hero -> User : aria-live "Copied" checkmark
== Journey 2: Feature Exploration ==
User -> Shell : Scroll to #features
Shell -> Bento : notify via IntersectionObserver
Bento -> User : Fade-in bento cards
User -> Bento : Hover/tap card
Bento -> User : Apply inner glow + description emphasis
== Journey 3: Docs & GitHub ==
User -> External : Click Docs button
External -> User : Open docs.codemachine.co (new tab)
User -> Stars : Click star badge
Stars -> External : Open GitHub repo (new tab)
Stars -> Hero : Log event for analytics
@enduml
~~~

<!-- anchor: 4-cross-cutting-concerns -->
## 4. Cross-Cutting Concerns

Aura fidelity depends on coherent state management, strict responsive controls, and accessibility-first patterns.

<!-- anchor: 4-1-state-management -->
### 4.1. State Management

- **Approach:** React hooks + lightweight Context; no global store required for single-page static content.
- `useClipboardCommand`: stores `status` (`idle`, `success`, `error`), retries on failure by selecting text, logs results.
- `useGitHubStars`: fetches GitHub REST v3 endpoint on mount, caches `{count, timestamp}` in `localStorage` for 6 hours, exposes `loading`, `error`, `fallback` states.
- Feature flags pulled from `flags.ts` and provided via `FeatureFlagProvider` context; used to gate alternate simulation layouts or telemetry experiments.

<!-- anchor: 4-2-responsive-design -->
### 4.2. Responsive Design (Mobile-First)

- **Breakpoints:** Tailwind defaults — `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.
- **Patterns:**
  - Hero stack collapses to column layout with command bar and CTA occupying full width; nav toggles to icon-only menu.
  - VisualSimulationWindow hides terminal panes below `md`, replaced by static screenshot or simplified metric card to avoid horizontal scroll.
  - Bento grid switches from `md:grid-cols-3` to single-column stack, ensuring touch targets remain 48px tall.
  - Footer links wrap with centered alignment, preserving brand mark at top.
- `prefers-reduced-motion` honored by disabling shimmer/pulse animations and using opacity-only transitions.

<!-- anchor: 4-3-accessibility -->
### 4.3. Accessibility (WCAG 2.1 AA)

- Semantic structure with `<header>`, `<main>`, `<section>` (with `aria-labelledby`), and `<footer>` ensures screen-reader comprehension.
- All interactive elements (buttons, links, cards) receive `focus-visible` outlines using Aura focus token and maintain `:aria-pressed` states where toggled.
- Copy confirmation uses `aria-live="polite"` text plus icon change; fallback text selection supports keyboard copying.
- Color contrast: text placed on `bg-neutral-950` maintains 4.5:1 contrast; text-glow used sparingly to avoid halos harming legibility.
- Keyboard navigation: sticky nav includes first element skip link to hero, while tab order respects DOM order with no tabindex overrides except `-1` for focus traps.

<!-- anchor: 4-4-performance -->
### 4.4. Performance & Optimization

- **Budgets:** Sub-200KB gzipped JS, LCP < 2.5s on cable, CLS < 0.05, TTI < 3.0s.
- **Strategies:**
  - Tree-shake Lucide by importing individual icons; load fonts via `preconnect` + `display=swap`.
  - Use CSS gradients + masks for glows/noise instead of image assets; fallback static noise encoded inline.
  - Defer non-critical animations with `requestIdleCallback`; load GitHub fetch after `DOMContentLoaded` to prioritize hero.
  - Memoize heavy components (VisualSimulationWindow) and prevent unnecessary rerenders by freezing config objects.
  - Serve optimized static screenshot for mobile simulation (<35KB WebP).

<!-- anchor: 4-5-backend-integration -->
### 4.5. Backend Integration

- GitHub star fetch uses `fetch('https://api.github.com/repos/moazbuilds/CodeMachine-CLI')` with optional `Authorization` header sourced from `import.meta.env.VITE_GITHUB_TOKEN`.
- Retry policy: up to 2 retries with exponential backoff; on failure, show `100+ Stars` fallback string and log via `console.warn`.
- All outbound links append `rel="noopener noreferrer"` for security; docs link uses canonical domain `http://docs.codemachine.co/`.
- Analytics hook (`trackEvent`) batches copy/button interactions and posts to optional PostHog endpoint when available; degrade gracefully when network offline.

<!-- anchor: 5-tooling-and-dependencies -->
## 5. Tooling & Dependencies

<!-- anchor: 5-1-core-dependencies -->
### 5.1. Core Dependencies

- **React 18 + Vite:** SPA scaffold with fast dev server and static export.
- **Tailwind CSS + custom config:** Implements Aura palette, glassmorphism utilities, noise/grids, typography stack.
- **Lucide Icons:** Tree-shaken icon set for CPU, copy, menu, GitHub, telemetry glyphs.
- **Framer Motion (optional) / IntersectionObserver hooks:** Provides scroll-triggered fade-ins; default to native implementations for footprint control.
- **clsx & Tailwind Merge:** Compose utility strings cleanly when toggling hover states or feature flag variants.
- **date-fns (optional):** Format timestamps for telemetry readouts if dynamic data introduced.

<!-- anchor: 5-2-development-tooling -->
### 5.2. Development Tooling

- **ESLint + TypeScript + Prettier:** Enforce strict types for config modules (`HeroContent`, `FeatureCard`, `ExternalLink`, `StarMetric`) and consistent code style.
- **Storybook (optional but recommended):** Document glass cards, command panel, and status badges for isolated visual QA.
- **Playwright smoke script:** Validate clipboard button, docs link, and GitHub fetch fallback post-build.
- **GitHub Actions workflow:** Run `pnpm lint`, `pnpm test`, and Percy/Chromatic visual regression before deploying to Netlify/Vercel.
- **SVGO + imagemin:** Optimize inline SVG noise texture and any exported screenshots.
