<!-- anchor: 3-0-proposed-architecture-operational-view -->
## 3. Proposed Architecture (Operational View)

This operational view translates the Aura-themed landing page into a deployment-ready asset by binding each UI module to clear operational responsibilities. It respects the foundation directive to ship a small-scale SPA with deterministic data and premium micro-interactions while avoiding unnecessary server infrastructure.

React 18 + Vite produce hashed static assets served from Vercel edge nodes, with environment-protected GitHub tokens injected at build time when rate limiting arises. Client-only enhancements (clipboard, IntersectionObserver animations, optional GSAP reveals) run after hydration and degrade gracefully whenever APIs are missing or motion preferences prefer reduced animations.

Operations focus across the major modules ensures that experience, resilience, and instrumentation remain aligned with the blueprint components:

- **ExperienceShell:** Anchors the noise textures, ambient glows, and sticky navigation, exposing only static props so that CDN-cached HTML stays deterministic.
  It is also responsible for initializing Lucide icons and the analytics `trackEvent` helper during idle time so that telemetry overhead never blocks first paint.
- **HeroCommandPanel:** Manages the copy-to-clipboard CTA, verifying `navigator.clipboard` availability, falling back to text selection, and emitting structured success/failure logs for observability as mandated in the rulebook.
  The module owns the CTA links to docs and GitHub, applying `rel="noopener noreferrer"` and focus-visible styles for accessibility and security.
- **VisualSimulationWindow:** Renders the glassmorphic terminal mockup with responsive guards that collapse into a simplified image below `md` viewports to respect the mobile constraint in Section 4.0.
  Its animation timers are flagged for progressive enhancement, enabling future GSAP timelines via feature flags without modifying unrelated sections.
- **FeatureBentoGrid:** Maps `FeatureCard` configs into responsive cards and wraps each with IntersectionObserver-driven fades plus hover glows (`ring-white/10`, `hover:bg-white/5`) to satisfy the Journey 2 requirements.
  Scroll state updates run inside `requestAnimationFrame` to keep the performance budget intact even during dense scroll interactions.
- **IntegrationStatusBar & ContentConfigModule:** Fetches GitHub stars with retry/backoff, caches the value and timestamp in `localStorage` for six hours, and falls back to "100+ Stars" when offline.
  Content modules store `HeroContent`, `FeatureCard`, and `ExternalLink` entities, enforcing compile-time validation so that releases remain deterministic while still editable by marketing.

<!-- anchor: 3-8-cross-cutting-concerns -->
### 3.8. Cross-Cutting Concerns

- **Authentication & Authorization:** The SPA exposes only public content, so no user authentication is required; however, outbound fetches to GitHub may leverage an optional read-only personal access token stored in Vercel environment variables (`GITHUB_TOKEN_RO`) and injected at build time.
  Runtime code guards every privileged browser API (clipboard, storage) with capability checks, and outbound links always open in isolated tabs with `rel="noopener noreferrer"` to prevent privilege escalation.
  Feature flags in `flags.ts` gate unfinished experiences, ensuring that only whitelisted functionality renders in production builds that pass CI toggles.
- **Logging & Monitoring:** Clipboard operations, GitHub fetch attempts, and feature-flag decisions emit structured `console.info|warn` messages containing component names and timestamps to accelerate debugging.
  The shared `trackEvent` helper batches PostHog (or similar) beacons using `navigator.sendBeacon` so that analytics never block navigation, while Vercel Web Analytics captures page-level vitals for broader monitoring.
  Build-time logging is enforced via Vite plugins that fail the pipeline when bundle size budgets (200KB gzipped critical JS) are exceeded.
- **Security Considerations:** Full-site HTTPS is inherited from Vercel, and a tight `Content-Security-Policy` (self plus GitHub/Tailwind CDN origins) is published through Vercel headers to minimize injection risks.
  Secrets remain within Vercel's encrypted environment system and never ship to the browser; the optional GitHub token is proxied at build time so that runtime fetches stay unauthenticated.
  Dependency scanning (`pnpm audit`, `npm audit --production`) and Renovate-style update checks run in CI to prevent stale packages, while Docker-based local parity (node:20-alpine + pnpm) constrains the supply chain.
- **Scalability & Performance:** The architecture is inherently scalable because static assets are immutable and cached on Vercel's global edge; spikes in traffic simply translate to more CDN hits without service tuning.
  Build artifacts tree-shake unused Lucide icons, compress SVG noise textures via SVGO, and lazy-load non-critical animations using `requestIdleCallback`.
  GitHub star responses are memoized for six hours to reduce remote calls, and `IntersectionObserver` replaces heavier scroll libraries so that low-end mobile GPUs keep up with transitions.
- **Reliability & Availability:** Vercel's atomic deploys ensure new builds go live only after successful verification, with instant rollbacks if regressions appear, preserving high availability for marketing pushes.
  Client-side fallbacks (static star label, copy fallback selection, disabled heavy simulations on mobile) keep core user journeys functioning even when external APIs or capabilities fail.
  Health signals are verified through lightweight synthetic checks that load the CDN asset, run clipboard operations, and fetch GitHub stars from a monitoring location every 15 minutes, alerting the team if resiliency paths engage.

<!-- anchor: 3-9-deployment-view -->
### 3.9. Deployment View

Vercel serves as the target environment per the foundation, providing edge caching, automatic TLS, and environment-secret management for optional GitHub credentials and analytics API keys.
Netlify remains a viable secondary host, but Vercel is primary because it offers branch previews, instant rollbacks, and integrated analytics aligned with the small-scale directive.

1. Source-of-truth code is merged into `main`, triggering GitHub Actions that run `pnpm install`, `pnpm lint`, `pnpm test`, and `pnpm build` inside a Docker image based on `node:20-alpine` with `pnpm` preinstalled for deterministic node_modules resolution.
2. Successful pipelines produce the `/dist` artifacts plus a manifest capturing bundle sizes and hashes; this bundle is uploaded via the Vercel CLI using a deploy key scoped only to this project.
3. Vercel's build image reproduces the same Node 20 environment, hydrates fonts/noise assets, injects environment variables, and exports the static `index.html`, CSS, and JS files to the global edge network.
4. After deployment, cache invalidation propagates within seconds; Vercel Web Analytics and optional PostHog webhooks confirm that instrumentation endpoints are reachable, and observability alerts arm themselves with the current release ID.
5. Operational runbooks document how to toggle feature flags (environment-variable booleans), rotate the GitHub token, and perform rollback by pinning to the previous deployment ID in the Vercel dashboard, keeping mean-time-to-recovery low.

Docker remains a local-only construct to give contributors parity with CI; developers run `docker build -t codemachine-site .` (with node:20-alpine base) to lint/build offline, ensuring that what ships matches the production runtime.
Edge-cached assets reside behind Vercel's WAF and CDN, and static headers enforce caching directives (`Cache-Control: public, max-age=31536000, immutable` for hashed assets and `no-cache` for HTML) for predictable behavior.

**Deployment Diagram (PlantUML):**
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml
LAYOUT_WITH_LEGEND()
Person(user, "Visitor", "Senior/Staff engineer evaluating CodeMachine CLI")
Node(browser, "User Browser", "Chrome/Safari/Edge", "Executes React bundle, handles clipboard and animations")
Node(vercelEdge, "Vercel Edge Network", "Global CDN + TLS", "Caches static HTML/CSS/JS assets")
Node(vercelBuild, "Vercel Build Image", "node:20-alpine + pnpm", "Runs Vite build and publishes immutable artifacts")
Container(spa, "CodeMachine Landing Page", "React 18 + Vite + Tailwind", "Aura-themed static assets, clipboard + fetch hooks")
Node(github, "GitHub REST API", "Stars endpoint", "moazbuilds/CodeMachine-CLI metadata")
Node(posthog, "PostHog (optional)", "Analytics endpoint", "Receives trackEvent beacons")
Rel(user, browser, "Navigates codemachine.co", "HTTPS")
Rel(browser, vercelEdge, "Requests static assets", "HTTPS/HTTP2")
Rel(vercelEdge, spa, "Serves hashed bundles", "Edge cache")
Rel(spa, github, "Fetch star count", "HTTPS with optional token header")
Rel(spa, posthog, "Send analytics beacons", "HTTPS, fire-and-forget")
Rel(vercelBuild, vercelEdge, "Publishes build outputs", "Vercel deploy hooks")
@enduml
```

<!-- anchor: 3-9-1-deployment-controls -->
#### 3.9.1 Deployment Controls & Tooling

Release controls revolve around root-cause transparency: every deploy ties back to a Git commit hash, GitHub Action run, and Vercel deployment ID, allowing Ops to trace regressions within minutes.
Automated gates keep the small-yet-premium experience stable while still enabling rapid iteration demanded by marketing launches.

- **Release Verification:** CI executes `pnpm vitest --runInBand` (for clipboard helpers), Lighthouse smoke tests through `pnpm exec lhci autorun`, and screenshot diffs before Vercel is allowed to promote an artifact.
  Build metadata (bundle sizes, git SHA, active feature flags) is published to a `release.json` stored alongside the artifact for forensic use.
- **Configuration Management:** Content configs (`hero.ts`, `features.ts`) remain versioned in git; runtime toggles map to `NEXT_PUBLIC_*` vars so that Vercel preview deployments can test alternate experiences without code changes.
  When multi-variant experiments are needed, environment-specific flag files are bundled, and only the desired flag file is referenced via `import()` during build.
- **Secrets & Access:** Only the GitHub Action service account may trigger Vercel production deploys, enforced via deploy hooks limited to the repo, and secrets are rotated quarterly with reminders captured in the runbook checklist.
  Local development uses `.env.local` templates with dummy values so that real credentials never leak into pull requests.
- **Incident Response & Testing in Production:** If telemetry signals a regression, operators can pause the GitHub star fetch (flip `FEATURE_STAR_FETCH=false`) and let the cached/fallback badge take over while investigating.
  Rollbacks are scriptable through `vercel rollback <deploymentId>` and documented alongside a five-minute synthetic test suite that validates copying, navigation, and animation toggles after every recovery.

These controls, paired with the immutable static artifacts, let a small team own the entire operational surface without standing up additional infrastructure, fulfilling the project's lean-yet-premium directive.

<!-- anchor: 3-9-2-observability-runbooks -->
#### 3.9.2 Observability Runbooks

Operational maturity also depends on consistent visibility into the live page from multiple regions and device classes.
A lightweight runbook keeps the cycles predictable even for a lean team.

- **Synthetic Monitoring:** Uptime checks (Pingdom or Checkly) execute the full hero+copy flow every fifteen minutes from at least three continents, logging whether the clipboard toast appears and whether the GitHub badge resolves within two seconds.
  Failures trigger Slack alerts with HAR files so developers can reproduce the issue locally or within the Docker parity image.
- **Analytics QA:** After every deploy, a scripted Cypress run verifies that `trackEvent` batches ship to PostHog only after consent and that Vercel Web Analytics is collecting Core Web Vitals; discrepancies block the release until fixed.
  Dashboards aggregate copy events, doc clicks, and GitHub outbound traffic so growth teams can correlate marketing campaigns with actual installer interest.
- **Performance Budgets:** Weekly cron jobs run `pnpm exec bundlesize` and `pnpm exec source-map-explorer` to ensure the critical path stays inside the 200KB gzipped envelope.
  Deviations automatically open GitHub issues tagged `ops/perf`, forcing remediation before new features can merge.

By codifying these observability practices, the team ensures the static architecture remains transparent, measurable, and easy to evolve without accruing operational debt.
