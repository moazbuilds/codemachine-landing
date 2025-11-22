<!-- anchor: iteration-2-plan -->
### Iteration 2: Immersive Hero & Integrations

- **Iteration ID:** `I2`
- **Goal:** Deliver the hero, clipboard interactions, simulation window, and GitHub integration so visitors can copy/install, visualize workflows, and trust live metrics.
- **Prerequisites:** `I1`
- **Iteration Deliverables Snapshot:**
  - Fully styled hero with copy-to-clipboard CTA, docs button, and badge referencing latest CLI beta label.
  - Glassmorphism simulation window plus PlantUML journey sequence diagram mirroring Journey 1.
  - GitHub star badge with fetch/caching logic and Markdown spec describing API contract + fallback rules.
- **Iteration Coordination Notes:** Agents should align on animation timing tokens (pulse, shimmer, fade) before landing hero + simulation to avoid conflicting durations; share ScrollReveal context signatures in the task hand-off doc.
- **Iteration KPI Focus:** Achieve <150ms clipboard response, seamless hero fade-in under 400ms, and 100% success fallback for GitHub fetch within 2 retries.
- **Iteration Quality Gates:**
  - Playwright smoke for copy button + docs link must pass in CI.
  - GitHub fetch mocked tests must demonstrate retry-with-timeout path and fallback copy.
- **Tasks:**

<!-- anchor: task-i2-t1 -->
- **Task 2.1:**
    - **Task ID:** `I2.T1`
    - **Description:** Implement `HeroCommandPanel` with Aura typography, pill badge, command snippet, copy icon state machine, docs CTA, and `aria-live` feedback that reuses typed HeroContent plus analytics hooks.
    - **Agent Type Hint:** `FrontendAgent`
    - **Inputs:** Section 2 (Key Components), Journey 1 requirements, HeroContent config from `src/content/hero.ts`.
    - **Input Files:** [`src/App.tsx`, `src/content/hero.ts`, `src/content/index.ts`, `src/components/ExperienceShell/index.tsx`]
    - **Target Files:** [`src/components/HeroCommandPanel/index.tsx`, `src/components/HeroCommandPanel/CopyButton.tsx`, `src/hooks/useClipboardCommand.ts`, `src/styles/hero.css`]
    - **Deliverables:** Responsive hero component with IntersectionObserver fade-in, copy toast/checkmark, docs CTA opening new tab, and analytics events for copy success/failure + docs click.
    - **Acceptance Criteria:** Button copies to clipboard or selects text fallback within 150ms; docs link uses `rel="noopener noreferrer"`; hero passes Lighthouse accessibility; hooking integrated into `App` with focus order preserved.
    - **Testing Focus:** Vitest unit for `useClipboardCommand` rejection path, Playwright smoke verifying toast appears and docs link opens new tab attribute.
    - **Dependencies:** `I1.T3`
    - **Parallelizable:** No

<!-- anchor: task-i2-t2 -->
- **Task 2.2:**
    - **Task ID:** `I2.T2`
    - **Description:** Build `VisualSimulationWindow` showcasing terminal panes, telemetry, and animation tokens with mobile fallback plus generate PlantUML sequence diagram covering Journey 1 (from load to copy success/failure).
    - **Agent Type Hint:** `FrontendAgent`
    - **Inputs:** Section 2 (Communication Patterns), Section 2.1 artifacts, Journey 2 cues.
    - **Input Files:** [`src/App.tsx`, `src/components/ExperienceShell/index.tsx`, `docs/diagrams/component_overview.mmd`]
    - **Target Files:** [`src/components/VisualSimulationWindow/index.tsx`, `src/components/VisualSimulationWindow/MobileCard.tsx`, `src/hooks/useScrollReveal.ts`, `docs/diagrams/journey_install_sequence.puml`]
    - **Deliverables:** Desktop + mobile simulation variants with glass-card styling, scroll-triggered fade/perspective effect, and PlantUML diagram ready for rendering.
    - **Acceptance Criteria:** Simulation hides heavy elements below `md` while showing simplified card; diagram passes PlantUML render; animations respect `prefers-reduced-motion`; component reusable via props.
    - **Testing Focus:** Browser-based responsiveness audit plus screenshot diff for hero + simulation alignment; ensure IntersectionObserver unobserves on cleanup.
    - **Dependencies:** `I2.T1`
    - **Parallelizable:** Yes

<!-- anchor: task-i2-t3 -->
- **Task 2.3:**
    - **Task ID:** `I2.T3`
    - **Description:** Implement `IntegrationStatusBar` hook + component to fetch GitHub stars with retries/cache, surface fallback label, and document the API contract + error handling inside `api/github_star_fetch.md`.
    - **Agent Type Hint:** `BackendAgent`
    - **Inputs:** Section 2 (API Contract Style), error-handling requirements, Sequence diagram from `I2.T2`.
    - **Input Files:** [`src/content/links.ts`, `src/content/index.ts`, `src/lib/analytics.ts`]
    - **Target Files:** [`src/components/IntegrationStatusBar/index.tsx`, `src/hooks/useGitHubStars.ts`, `src/lib/github.ts`, `api/github_star_fetch.md`]
    - **Deliverables:** React component rendering star badge in nav/footer, hook caching results in `localStorage`, Markdown spec outlining endpoint, headers, retry, TTL, fallback copy, and instrumentation events.
    - **Acceptance Criteria:** Successful fetch updates badge without blocking main thread; failure falls back to `100+ Stars`; Markdown spec reviewed for accuracy; caching TTL default 6h with env override.
    - **Testing Focus:** Vitest tests for hook fallback path; mocked fetch verifying two retries; docs lint ensures Markdown spec links to GitHub repo and docs.
    - **Dependencies:** `I1.T2`, `I2.T1`
    - **Parallelizable:** Yes

<!-- anchor: task-i2-t4 -->
- **Task 2.4:**
    - **Task ID:** `I2.T4`
    - **Description:** Polish interaction + accessibility by wiring ScrollReveal context, ensuring hero/simulation animations respect reduced-motion, adding analytics helper, and updating README with clipboard + GitHub troubleshooting tips.
    - **Agent Type Hint:** `AccessibilityAgent`
    - **Inputs:** Outputs of `I2.T1`–`I2.T3`, Section 4 directives.
    - **Input Files:** [`src/hooks/useScrollReveal.ts`, `src/lib/analytics.ts`, `README.md`]
    - **Target Files:** [`src/context/ScrollRevealProvider.tsx`, `src/lib/analytics.ts`, `README.md`]
    - **Deliverables:** Shared provider controlling animation triggers, `trackEvent` utility capturing copy/docs/star clicks, README section on troubleshooting clipboard permissions + GitHub fallbacks.
    - **Acceptance Criteria:** `prefers-reduced-motion` disables transitions; analytics helper debounces duplicate events; README documents fallback flows; ESLint accessibility plugin passes.
    - **Testing Focus:** Manual audit using dev tools to toggle reduced motion, plus Playwright script verifying `aria-live` updates; run ESLint accessibility presets.
    - **Dependencies:** `I2.T1`, `I2.T2`, `I2.T3`
    - **Parallelizable:** No

- **Exit Criteria:** Hero, simulation, and GitHub badge all render with required interactions; Markdown spec + diagrams committed; README updated with troubleshooting guidance; automated tests for clipboard + fetch run green.
- **Risks & Mitigations:** Clipboard API restrictions mitigated via fallback selection; GitHub rate limits mitigated with TTL caching + optional token env var; animation jank mitigated by gating reveals via context and honoring reduced motion.
- **Iteration Reporting:** Capture hero conversion metrics placeholder plus fetch latency numbers in dev-log for visibility heading into `I3`.
- **Support Artifacts Produced:** `docs/diagrams/journey_install_sequence.puml` and `api/github_star_fetch.md` with anchors listed for manifest reference.
- **Open Questions for Iteration 3:**
  - Determine if GitHub badge also belongs in footer or hero chip for additional social proof.
  - Align on final animation durations for feature cards before implementing scroll reveals in `I3`.
