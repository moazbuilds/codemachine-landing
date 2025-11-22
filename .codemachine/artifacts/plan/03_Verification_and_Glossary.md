<!-- anchor: verification-and-integration-strategy -->
## 6. Verification and Integration Strategy

- **Testing Levels:**
  - *Unit:* Vitest targets clipboard hooks, GitHub fetch helpers, analytics utilities, and FeatureCard rendering logic, enforcing strict typing and ensuring fallbacks return deterministic results.
  - *Component:* Storybook or React Testing Library specs exercise ExperienceShell, HeroCommandPanel, VisualSimulationWindow, and FeatureBentoGrid to verify props/context contracts, animation toggles, and accessibility roles.
  - *Integration:* Playwright component tests validate navigation + hero interplay, ScrollReveal context, and docs/GitHub outbound links; tests assert `rel="noopener noreferrer"`, `aria-live` copy feedback, and reduced-motion toggles.
  - *E2E Journeys:* Playwright suites cover Journey 1 (landing + copy), Journey 2 (scroll + hover), and Journey 3 (docs/GitHub navigation) on desktop and mobile viewports with throttle to simulate real bandwidth.
- **Integration Readiness Reviews:**
  - Each iteration ends with a dev-log entry summarizing outstanding risks; L2 reviewer checks README and manifest anchors to ensure downstream agents can locate artifacts.
  - GitHub fetch integration validated via mocked tests plus live smoke hitting API with low rate-limit account to confirm fallback string engages gracefully.
- **CI/CD Flow:**
  - GitHub Actions pipeline: checkout → pnpm cache restore → `pnpm install` → `pnpm lint` → `pnpm test` → `pnpm build` → Playwright (`npx playwright test --config=ci.config.ts`) → `pnpm exec lhci autorun` → upload artifacts (Lighthouse JSON, screenshots) → conditional `vercel deploy --prebuilt` or `netlify deploy --prod`.
  - Docker job uses node:20-alpine + pnpm to double-check builds for parity; failures block deploy until rerun passes.
- **Code Quality Gates:**
  - ESLint (Airbnb + jsx-a11y) and Stylelint enforce class ordering; TypeScript `strict` prevents implicit anys; Tailwind `content` globs keep bundle lean; bundler guard ensures gzipped JS < 200KB and CSS < 80KB.
  - Coverage threshold ≥80% for hooks/libs; Playwright must cover all user journeys; `pnpm audit --prod` or `npm audit --omit=dev` runs before deploy.
  - Accessibility budget: Lighthouse Accessibility ≥95, Axe-core zero critical violations.
- **Artifact Validation:**
  - PlantUML + Mermaid sources compiled via CLI in CI; failure prevents merge; README references diagrams with anchors; `plan_manifest.json` auto-updated to map anchor IDs.
  - `api/github_star_fetch.md` linted with Markdownlint, cross-link checked to GitHub repo and docs site; verification checklist stored under `docs/adr` and reviewed each release.
- **Continuous Verification Cadence:**
  - Synthetic monitoring (Pingdom/Checkly) executes hero copy + docs click every 15 minutes; alerts opened if clipboard fallback triggers twice consecutively.
  - Weekly cron runs `pnpm exec bundlesize` and `pnpm exec source-map-explorer` to enforce performance budgets; findings recorded in ADR checklist.
- **Release Management:**
  - Verification checklist enumerates owners per gate (frontend lead, QA, ops) and includes sign-off boxes; release candidate merges only when checklist signed.
  - Post-release monitoring uses console analytics plus optional PostHog to detect clipboard failure spikes or fetch latency; rollbacks performed via Vercel CLI referencing previous deployment ID.
- **Integration Strategy:**
  - Feature flags toggled through `flags.ts` with env overrides (e.g., `VITE_ENABLE_SIM_SEQUENCE=true`), allowing partial rollouts; ScrollReveal context ensures components subscribe to a single observer instance; analytics helper centralizes event schema so downstream services share consistent payloads.
  - GitHub fetch uses Stale-While-Revalidate pattern: cached `StarMetric` served immediately, background fetch updates badge when available; fallback string logged for telemetry and surfaced in dev tools.
- **Data Validation:**
  - Content config modules run through `zod` (optional) or custom asserts to catch missing titles/icons; build fails if FeatureCard grid spans not recognized, preventing runtime layout breaks.
  - External link validation script ensures URLs are HTTPS (docs + GitHub) and include icons defined within Lucide import list.
- **Incident Response:**
  - If clipboard failure rate exceeds 5% over 30 minutes, toggle feature flag to show fallback instructions prominently and open an ops issue.
  - If GitHub API returns rate-limit errors for >6 hours, update README + site banner with static "100+ Stars" copy until tokens refreshed; use Vercel rollback if UI regresses.

<!-- anchor: glossary -->
## 7. Glossary

- **Aura Theme:** Prescribed dark-mode aesthetic (neutral-950 backgrounds, indigo accents, noise/glow layers) ensuring visual consistency with the reference HTML provided in Section 5.0.
- **ExperienceShell:** Root React layout orchestrating navigation, ambient glows, noise overlays, context providers, and analytics initialization; all sections mount within this shell.
- **HeroCommandPanel:** Hero module presenting the install command, copy CTA, docs button, and `aria-live` toast; interacts with analytics + clipboard hooks to fulfill Journey 1 requirements.
- **VisualSimulationWindow:** Glassmorphic terminal simulation and telemetry stack that communicates the multi-agent narrative; collapses into simplified MobileCard on small viewports while logging animation status events.
- **FeatureBentoGrid:** Responsive grid rendering FeatureCard content (custom spans, hover glows, ScrollReveal animations) demonstrating customizable workflows, collaboration, and parallel execution.
- **IntegrationStatusBar:** Component/hook responsible for fetching GitHub stars, caching results, logging fallback events, and placing star badges in nav/footer without blocking the main thread.
- **ContentConfigModule:** Typed configuration exports (hero, features, links, flags, star metrics) stored in `src/content/` to keep marketing copy and layout metadata version-controlled.
- **ScrollRevealProvider:** Context wrapper exposing IntersectionObserver state to hero, simulation, and bento components, coordinating fade-ins and reduced-motion preferences.
- **Verification Checklist:** Markdown artifact in `docs/adr/verification_checklist.md` outlining lint/test/lighthouse/playwright gates, owners, cadence, and rollback steps.
- **TrackEvent Helper:** Shared analytics utility housed in `src/lib/analytics.ts` that throttles event emission and standardizes payload schema for copy/docs/star interactions.
- **DeploymentPipeline:** GitHub Actions + Vercel/Netlify configuration responsible for building, testing, and promoting the static site; enforces parity with the Docker image defined in Iteration 1.
- **StarMetric Cache:** `localStorage` entry storing the last successful GitHub star count, timestamp, TTL (default 6h), and fallback text, used by IntegrationStatusBar to provide instant social proof even if the API is offline.
