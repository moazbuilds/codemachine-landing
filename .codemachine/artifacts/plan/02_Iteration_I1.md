<!-- anchor: iteration-plan-overview -->
## 5. Iteration Plan

- **Total Iterations Planned:** 3
- **Iteration Dependencies:** `I1` establishes scaffolding and data contracts consumed by `I2` for interactive hero/integration work, while `I3` builds upon both to finish feature grid, docs links, and verification assets.
- **Iteration Coordination Notes:** All agents share the same pnpm/Tailwind toolchain; changes to config files must be announced in the task hand-off notes to avoid version drift in later iterations.
- **Iteration Deliverables Snapshot:**
  - Base React + Tailwind workspace with Docker parity image and fonts/noise assets in place.
  - Typed content configs plus ERD + component diagrams living under `docs/diagrams/` for downstream agents.

<!-- anchor: iteration-1-plan -->
### Iteration 1: Foundation & Content Contracts

- **Iteration ID:** `I1`
- **Goal:** Stand up the React + Tailwind workspace, encode Aura theming, and define the typed content/diagram artifacts required for later feature work.
- **Prerequisites:** None
- **Iteration KPI Focus:** Ship a runnable dev server (`pnpm dev`), complete typed content coverage, and publish both ERD + component diagram sources in `docs/diagrams`.
- **Tasks:**

<!-- anchor: task-i1-t1 -->
- **Task 1.1:**
    - **Task ID:** `I1.T1`
    - **Description:** Scaffold a Vite + React 18 + TypeScript project with Tailwind Aura configuration, Inter/JetBrains fonts, PostCSS setup, pnpm scripts, and Docker parity baseline; include base noise texture, Lucide bootstrapping, and Lighthouse-friendly meta tags inside `index.html` so later tasks tweak UI only.
    - **Agent Type Hint:** `SetupAgent`
    - **Inputs:** Section 2 (Core Architecture), Section 3 (Directory Structure), Section 5 requirements for Aura theming.
    - **Input Files:** []
    - **Target Files:** [`package.json`, `pnpm-lock.yaml`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `postcss.config.cjs`, `Dockerfile`, `src/main.tsx`, `src/index.css`, `public/index.html`]
    - **Deliverables:** Compilable workspace with scripts (`dev`, `build`, `preview`), Tailwind config featuring Aura palette/noise/glow utilities, HTML head with fonts + tailwind init, Dockerfile matching CI image.
    - **Acceptance Criteria:** `pnpm build` succeeds; Tailwind config exposes `neutral` + `primary` tokens and custom animations; HTML loads fonts/noise overlays per Section 5.1; repository root matches directory plan, and Docker image runs `pnpm build` without extra flags.
    - **Testing Focus:** Run `pnpm lint` + `pnpm build` inside local shell and Docker container to confirm parity and catch misconfigured Tailwind plugins early.
    - **Dependencies:** None
    - **Parallelizable:** No

<!-- anchor: task-i1-t2 -->
- **Task 1.2:**
    - **Task ID:** `I1.T2`
    - **Description:** Implement typed content modules (HeroContent, FeatureCard, ExternalLink, FeatureFlag, StarMetric helpers) plus export barrel; generate the PlantUML ERD documenting these relationships and include render instructions in a doc comment.
    - **Agent Type Hint:** `ContentAgent`
    - **Inputs:** Section 3 (Data Model Overview), Section 2.1 artifact list.
    - **Input Files:** [`src/main.tsx`]
    - **Target Files:** [`src/content/types.ts`, `src/content/hero.ts`, `src/content/features.ts`, `src/content/links.ts`, `src/content/flags.ts`, `src/content/index.ts`, `docs/diagrams/data_model_erd.puml`]
    - **Deliverables:** Strongly typed config exports with default content matching the requirements, shared helper for GitHub fallback copy, ERD PlantUML file ready for rendering.
    - **Acceptance Criteria:** TypeScript builds without `any`; exported arrays/objects cover all properties listed in Section 3.0; ERD renders via plantuml.com without syntax errors; README or inline comments mention how to regenerate the ERD.
    - **Testing Focus:** Add Vitest unit covering `buildStarFallback` helper plus type-level tests via `tsc --noEmit` to ensure strict mode stays clean.
    - **Dependencies:** `I1.T1`
    - **Parallelizable:** No

<!-- anchor: task-i1-t3 -->
- **Task 1.3:**
    - **Task ID:** `I1.T3`
    - **Description:** Create ExperienceShell layout with background layers, sticky navigation skeleton, shared providers (ScrollReveal context placeholder, FeatureFlag provider), and wire content modules into `App`, ensuring nav links already route to docs/GitHub stubs.
    - **Agent Type Hint:** `FrontendAgent`
    - **Inputs:** Section 2 (Key Components/Services), Section 5 user journeys.
    - **Input Files:** [`src/main.tsx`, `src/content/index.ts`, `src/index.css`]
    - **Target Files:** [`src/App.tsx`, `src/components/ExperienceShell/index.tsx`, `src/components/NavigationBar/index.tsx`, `src/components/ExperienceShell/BackgroundLayers.tsx`, `src/styles/tokens.css`]
    - **Deliverables:** Rendered page skeleton with Aura background noise/glows, nav placeholders (logo, docs/GitHub links), context providers ready for child sections, and instrumentation stubs for analytics logging.
    - **Acceptance Criteria:** App renders backgrounds + nav without hero content yet; lint/type-check passes; navigation uses `ExternalLink` data; providers expose contexts without runtime warnings; layout respects responsive guidelines and mobile nav toggles collapse gracefully even if menu still static.
    - **Testing Focus:** Add Storybook or snapshot entry (optional) plus visual smoke via `pnpm exec playwright codegen` snippet to confirm nav anchors exist.
    - **Dependencies:** `I1.T1`, `I1.T2`
    - **Parallelizable:** Yes

<!-- anchor: task-i1-t4 -->
- **Task 1.4:**
    - **Task ID:** `I1.T4`
    - **Description:** Document the established architecture by drafting README onboarding steps and generating the Mermaid component diagram that maps ExperienceShell, content modules, hooks, and future sections, calling out where hero/simulation/feature blocks will slot in.
    - **Agent Type Hint:** `DocumentationAgent`
    - **Inputs:** Section 2 (Key Components), Section 2.1 (Artifact commitments), output of `I1.T3`.
    - **Input Files:** [`src/App.tsx`, `src/components/ExperienceShell/index.tsx`, `src/content/index.ts`]
    - **Target Files:** [`README.md`, `docs/diagrams/component_overview.mmd`]
    - **Deliverables:** README describing setup scripts, directory layout, and feature flag usage; Mermaid diagram consistent with Section 2 descriptions and referencing actual component file paths.
    - **Acceptance Criteria:** Diagram renders without syntax errors and matches component responsibilities; README includes badges for npm install command, development instructions, artifact pointers, and iteration overview; anchors noted for manifest.
    - **Testing Focus:** Run Mermaid CLI (or markdown preview) to verify syntax plus grammar check README to keep onboarding tight; ensure manifest anchors documented.
    - **Dependencies:** `I1.T3`
    - **Parallelizable:** Yes

- **Exit Criteria:** All configs compile, diagrams checked into `docs/diagrams`, README onboarding validated by running `pnpm dev`, and lint/type-check pipelines ready for Iteration 2 hand-off.
- **Risks & Mitigations:** Toolchain drift will be avoided via Docker parity; diagram syntax errors prevented by running PlantUML preview before commit; Tailwind build bloat kept in check with strict purge settings defined this iteration.
- **Iteration Reporting:** Produce a short dev-log entry (stored in issue tracker or README appendix) summarizing open questions for copy/animation so `I2` agents know what is stable versus placeholder.
- **Open Questions to Resolve Next Iteration:**
  - Confirm whether GSAP is required beyond IntersectionObserver for hero fade-ins.
  - Decide on telemetry provider (PostHog vs. Vercel Web Analytics only) before wiring hooks in `I2`.
