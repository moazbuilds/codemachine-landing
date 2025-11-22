<!-- anchor: blueprint-foundation-root -->
# 01_Blueprint_Foundation.md

<!-- anchor: 1-0-project-scale -->
### **1.0 Project Scale & Directives for Architects**

*   **Classification:** Small
*   **Rationale:** Single-page marketing experience with deterministic content, no authenticated flows, and limited data shapes fits the Small profile even though it demands premium visuals and micro-interactions.
*   **Core Directive for Architects:** This is a **Small-scale** project; every architectural decision MUST emphasize rapid iteration, reusable UI primitives, and configuration-driven content so visuals can evolve without backend rewrites.
*   **Focus Areas:** Guarantee Aura-theme fidelity, seamless clipboard feedback, and resilient fallbacks for remote star counts without introducing unnecessary infrastructure.

---

<!-- anchor: 2-0-standard-kit -->
### **2.0 The "Standard Kit" (Mandatory Technology Stack)**

*This technology stack is the non-negotiable source of truth. All architects MUST adhere to these choices without deviation.*

*   **Architectural Style:** Static Single-Page Application delivered via CDN, with progressive enhancement hooks for clipboard, fetch, and scroll-triggered animations.
*   **Frontend:** React 18 + Vite build tooling with Tailwind CSS Aura configuration, Lucide Icons bundle, and GSAP (or Framer Motion) limited to lightweight fade/scroll reveals.
*   **Backend Language/Framework:** None; all data sourced from static JSON/TS config files compiled at build time, plus a client-side fetch to GitHub REST v3 for live stars.
*   **Database(s):** None; structured content stored in version-controlled config modules ensuring deterministic deploys.
*   **Cloud Platform:** Netlify or Vercel static hosting with edge caching; must support environment variables for GitHub token if rate limiting demands.
*   **Containerization:** Docker image only for local parity (node:20-alpine + pnpm) to keep CI deterministic; production deploys use platform build images.
*   **Messaging/Queues:** None required; clipboard fallback and GitHub fetch retries handled inside the browser event loop.
*   **Asset Pipeline:** Mandatory use of SVGO-optimized noise textures and preloaded fonts via Google Fonts to minimize layout shift.

---

<!-- anchor: 3-0-rulebook -->
### **3.0 The "Rulebook" (Cross-Cutting Concerns)**

*This section defines system-wide strategies that apply to all components. These rules ensure consistency across the entire architecture.*

*   **Feature Flag Strategy:** Client-side boolean flags stored in a `flags.ts` module; unfinished UI variants or experiments (e.g., alternate terminal simulation) MUST be wrapped with a flag defaulting to `false` and promoted via build-time toggles.
*   **Observability (Logging, Metrics, Tracing):** All asynchronous operations (GitHub star fetch, clipboard copy) MUST log success/failure via `console.info/warn` with structured messages; optionally forward events to a lightweight analytics endpoint (e.g., PostHog) using a shared `trackEvent` helper.
*   **Security:** External links open in new tabs with `rel="noopener noreferrer"`; GitHub API calls MUST use read-only tokens stored in environment variables and injected at build time; clipboard logic MUST guard against unavailable APIs before invoking.
*   **Performance Budget:** Ship under 200KB gzipped critical JS by tree-shaking lucide icons, using CSS-only glow effects where possible, and deferring non-critical animations until `requestIdleCallback`.
*   **Accessibility:** Enforce focus-visible states for all interactive elements, ensure the copy button exposes `aria-live` confirmation, and use semantic headings matching the hierarchy defined here.
*   **Responsive Behavior:** Breakpoints follow Tailwind defaults; below `md`, bento cards stack vertically, and heavy glassmorphism windows collapse into static imagery to prevent overflow.

---

<!-- anchor: 4-0-blueprint -->
### **4.0 The "Blueprint" (Core Components & Boundaries)**

*This section defines the high-level map of the system. It names the primary pieces that the specialist architects will detail.*

*   **System Overview:** A static React shell orchestrates hero, simulation, bento, and footer sections driven by structured data, while small client hooks handle clipboard interactions, GitHub stars, and scroll-triggered reveals to convey a premium CLI-native story without server complexity.
*   **Core Architectural Principle:** Each visual module consumes typed content models and exposes explicit props; styling tokens, animation timings, and external links flow through shared config so updating a section never requires touching unrelated components.

*   **Key Components/Services:**
    *   **ExperienceShell:** Wraps layout, background noise layers, ambient glows, and navigation including sticky behavior and doc/GitHub links; enforces Aura theming tokens.
    *   **HeroCommandPanel:** Renders headline, command snippet, copy-to-clipboard control, and documentation CTA while emitting analytics events for copy success/failure.
    *   **VisualSimulationWindow:** Implements glassmorphic terminal mockup with configurable panes, animations, and fallback static image for mobile.
    *   **FeatureBentoGrid:** Maps `FeatureCard` data to responsive grid cells, applying hover glows, scroll observers, and semantic icon rendering.
    *   **IntegrationStatusBar:** Fetches GitHub star count with retries, exposes skeleton state, and falls back to `100+ Stars` badge when API unreachable.
    *   **ContentConfigModule:** Centralizes `HeroContent`, `FeatureCard`, and `ExternalLink` definitions plus feature flags, ensuring deploy-time validation.
    *   **DeploymentPipeline:** CI workflow (GitHub Actions) running lint, type-check, and visual regression screenshot before pushing to Netlify/Vercel.

---

<!-- anchor: 5-0-contract -->
### **5.0 The "Contract" (API & Data Definitions)**

*This section defines the explicit rules of engagement between components. These contracts are the single source of truth. Parallel agents will build against these contracts, not their own assumptions, to ensure integration succeeds.*

*   **Primary API Style:** RESTful GET to `https://api.github.com/repos/moazbuilds/CodeMachine-CLI` (via fetch) returning JSON; all other data sourced from local config modules exported as typed objects.

*   **Data Model - Core Entities:**
    *   **HeroContent:** `headline`, `subheadline`, `install_command`, `start_command`, `beta_label`, `cta_link`; consumed solely by `HeroCommandPanel`.
    *   **FeatureCard:** `id`, `title`, `description`, `icon`, `grid_span`, `accentGlow`, `ctaLabel?`; used by `FeatureBentoGrid`.
    *   **ExternalLink:** `label`, `url`, `icon`, `location` (nav/footer/button), `newTab`.
    *   **StarMetric:** `label`, `count`, `timestamp`, `fallbackCopy`; owned by `IntegrationStatusBar` and cached in local storage for 6 hours.
    *   **VisualAsset:** `id`, `type` (`noise`, `glow`, `grid`), `opacity`, `blendMode`, `zIndex`; ensures consistent background layering.

---

<!-- anchor: 6-0-safety-net -->
### **6.0 The "Safety Net" (Ambiguities & Assumptions)**

*This section clarifies ambiguities from the user specifications to prevent incorrect work by the architects.*

*   **Identified Ambiguities:**
    *   Animation library preference (GSAP vs. native IntersectionObserver) is unspecified.
    *   GitHub star count authentication method and caching duration are not defined.
    *   Mobile representation of the glassmorphic simulation window lacks explicit guidance.

*   **Governing Assumptions:**
    *   Animations should default to native IntersectionObserver + CSS transitions, escalating to GSAP only if precise timelines are required; Behavior_Architect MUST document whichever path is chosen.
    *   GitHub fetch uses unauthenticated requests until rate limits appear; Ops_Docs_Architect MUST provide optional token instructions with 6-hour caching.
    *   On mobile, the simulation window collapses into a static screenshot or simplified card to preserve performance while retaining narrative context.
