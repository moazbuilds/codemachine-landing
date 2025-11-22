<!-- anchor: iteration-3-plan -->
### Iteration 3: Feature Grid, Responsiveness, and Release Readiness

- **Iteration ID:** `I3`
- **Goal:** Complete the feature bento grid, nav/footer links, responsiveness fallbacks, and verification/deployment assets so the landing page can ship with confidence.
- **Prerequisites:** `I2`
- **Iteration Deliverables Snapshot:**
  - FeatureBentoGrid with hover glows, scroll reveals, and content-driven layout spanning desktop/mobile cases.
  - Navigation/footer hardening plus docs/GitHub badges placed per user journeys.
  - Verification checklist, Playwright/Lighthouse outputs, and CI workflow ready for deployment.
- **Iteration KPI Focus:** 100% Lighthouse accessibility score ≥ 95, LCP < 2.5s on cable, and passing Playwright flows on both mobile + desktop viewports.
- **Iteration Coordination Notes:** Agents must coordinate on Tailwind responsive tokens to avoid conflicting breakpoints; any change to global CSS variables should be announced before running tests to keep diffs predictable.
- **Iteration Quality Gates:**
  - `pnpm test` (unit + integration) passes with new feature specs.
  - Lighthouse CI + Playwright CI both meet thresholds defined in Section 6.
- **Tasks:**

<!-- anchor: task-i3-t1 -->
- **Task 3.1:**
    - **Task ID:** `I3.T1`
    - **Description:** Implement `FeatureBentoGrid` mapping FeatureCard data to responsive layout, embed hover glows, scroll-triggered fade-up animations, and ensure mobile stack uses simplified glass cards with proper spacing.
    - **Agent Type Hint:** `FrontendAgent`
    - **Inputs:** FeatureCard config, Journey 2 requirements, ScrollReveal context.
    - **Input Files:** [`src/App.tsx`, `src/content/features.ts`, `src/context/ScrollRevealProvider.tsx`, `src/styles/hero.css`]
    - **Target Files:** [`src/components/FeatureBentoGrid/index.tsx`, `src/components/FeatureBentoGrid/FeatureCard.tsx`, `src/styles/bento.css`]
    - **Deliverables:** Grid component plus card subcomponent, CSS modules/Tailwind classes for inner glow + hover states, and hooks to register/unregister scroll reveals.
    - **Acceptance Criteria:** Desktop grid uses bento layout with spans from config; mobile view stacks vertically without overflow; hover states show `ring-white/10` + lighten effect; ScrollReveal triggers once per card; performance remains under 16ms per frame.
    - **Testing Focus:** Storybook entries or Jest snapshots per card variant, Playwright hover/tap assertions, manual audit for `prefers-reduced-motion` toggling.
    - **Dependencies:** `I2.T4`
    - **Parallelizable:** No

<!-- anchor: task-i3-t2 -->
- **Task 3.2:**
    - **Task ID:** `I3.T2`
    - **Description:** Finalize navigation/footer, docs links, GitHub placements, and responsive menu/stacking plus ensure ExternalLink config drives both nav + footer components with consistent aria labels.
    - **Agent Type Hint:** `FrontendAgent`
    - **Inputs:** ExternalLink config, Journey 3 requirements, Section 5.0 design cues.
    - **Input Files:** [`src/components/NavigationBar/index.tsx`, `src/components/ExperienceShell/index.tsx`, `src/content/links.ts`]
    - **Target Files:** [`src/components/NavigationBar/NavLinks.tsx`, `src/components/FooterCluster/index.tsx`, `src/styles/navigation.css`]
    - **Deliverables:** Sticky nav w/ doc + GitHub CTAs, mobile drawer or icon-only nav, footer cluster replicating CTA links, and consistent analytics events hooking into `trackEvent` for outbound clicks.
    - **Acceptance Criteria:** Links open in new tab, include `aria-label`, share icon/text combos per spec; mobile nav accessible with focus trap; footer contains docs + GitHub + social placeholders; nav animation smooth under 60fps.
    - **Testing Focus:** Playwright navigation spec verifying new tab attributes, Axe-core accessibility check, manual mobile test for focus trap.
    - **Dependencies:** `I2.T4`
    - **Parallelizable:** Yes

<!-- anchor: task-i3-t3 -->
- **Task 3.3:**
    - **Task ID:** `I3.T3`
    - **Description:** Execute responsiveness/performance hardening: apply noise/grid/perf tweaks, add lazy-loaded mobile screenshot for simulation fallback, and write Vitest/Playwright coverage for Journey 2 + 3 flows.
    - **Agent Type Hint:** `PerformanceAgent`
    - **Inputs:** Section 5.0 design directives, tasks `I3.T1` + `I3.T2` outputs.
    - **Input Files:** [`src/components/VisualSimulationWindow/index.tsx`, `src/styles/tokens.css`, `tests/e2e/*.spec.ts`] 
    - **Target Files:** [`public/mobile-sim.webp`, `src/styles/perf.css`, `tests/e2e/journey.spec.ts`, `tests/unit/hooks.test.ts`]
    - **Deliverables:** Optimized assets (noise, screenshot), deferred animation scripts leveraging `requestIdleCallback`, updated tests for Journey 2 + 3 (scroll reveals, docs/GitHub navigation), and documentation of performance budgets.
    - **Acceptance Criteria:** Lighthouse run meets KPI targets; Playwright covers copy -> docs -> GitHub flows; fallback screenshot loads <35KB; CSS ensures background textures never block main thread.
    - **Testing Focus:** Automated Lighthouse CI via `pnpm exec lhci autorun`, Playwright multi-viewport run, bundle analyzer screenshot to confirm sub-200KB JS.
    - **Dependencies:** `I3.T1`, `I3.T2`
    - **Parallelizable:** No

<!-- anchor: task-i3-t4 -->
- **Task 3.4:**
    - **Task ID:** `I3.T4`
    - **Description:** Create deployment + verification checklist (Markdown), wire GitHub Actions/Netlify/Vercel configs, and finalize README sections for deployment, env vars, and troubleshooting, ensuring manifest anchors exist.
    - **Agent Type Hint:** `DevOpsAgent`
    - **Inputs:** Section 2.1 (artifact commitment), Section 6 verification strategy, outputs of `I3.T3` tests.
    - **Input Files:** [`README.md`, `package.json`, `Dockerfile`, `tests/e2e/journey.spec.ts`]
    - **Target Files:** [`docs/adr/verification_checklist.md`, `.github/workflows/ci.yml`, `vercel.json` (or `netlify.toml`), `README.md`]
    - **Deliverables:** Checklist describing lint/test/lighthouse/playwright gates, CI workflow running pnpm install/lint/test/build/lhci, deployment config enabling env vars, README updates referencing new docs.
    - **Acceptance Criteria:** CI workflow green locally via `act` or dry-run; checklist lists owners + cadence; README includes deployment instructions and env variable docs; manifest-ready anchors for new docs.
    - **Testing Focus:** GitHub Actions workflow `--dry-run` or local `act` invocation, markdown lint for checklist, verifying Vercel CLI preview build script.
    - **Dependencies:** `I3.T3`
    - **Parallelizable:** Yes

- **Exit Criteria:** Feature grid polished, navigation/footer finalized, responsive/mobile fallbacks verified, CI workflows + checklist committed, and README updated for launch readiness.
- **Risks & Mitigations:** Possible Lighthouse regressions mitigated by bundler analyzer + CSS pruning; nav focus-trap regressions mitigated via Playwright accessibility scripts; CI flakiness mitigated by caching pnpm store.
- **Iteration Reporting:** Capture summary of Lighthouse scores, Playwright pass log, and outstanding marketing copy needs in dev-log before handoff to release.
- **Support Artifacts Produced:** `docs/adr/verification_checklist.md` plus CI workflow anchors for manifest inclusion.
- **Post-Iteration Follow-Ups:**
  - If marketing requests alternate hero copy, update `src/content/hero.ts` in a hotfix release following the checklist.
  - Monitor GitHub fetch rates after release; consider edge cache if rate limits observed beyond expectations.
