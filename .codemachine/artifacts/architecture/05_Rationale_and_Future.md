<!-- anchor: 4-0-design-rationale-trade-offs -->
## 4. Design Rationale & Trade-offs

This rationale distills the foundation's choices into a compact set of operational guardrails. Because the project is classified as Small, every decision emphasizes deterministic builds, rapid creative iteration, and graceful failure handling over heavy multi-service infrastructure.

<!-- anchor: 4-1-key-decisions-summary -->
### 4.1. Key Decisions Summary

- **Static React 18 + Vite SPA:** React 18 with Vite satisfies the need for modern JSX ergonomics while keeping the bundle small and build pipeline simple enough for CDN hosting.
  The trade-off is foregoing SSR/ISR, but the deterministic landing experience and lack of authenticated flows mean static generation is perfectly aligned with the goal.
- **Tailwind CSS Aura Theme:** A custom Tailwind config enforces the Aura palette (neutral-950 base, primary indigos, noise textures) so that every component inherits consistent tokens without hand-written CSS drift.
  Designers can update tokens centrally, yet we accept an upfront dependency on Tailwind's pipeline to preserve fidelity.
- **Vercel Edge + Docker Parity:** Deploying to Vercel leverages its edge caching, TLS, and preview builds, while the Docker (node:20-alpine + pnpm) image locks down local/CI parity.
  The trade-off is managing two environments (Docker and Vercel build images), but it guarantees reproducibility and faster incident response.
- **Client-Side GitHub Star Integration:** Fetching stars directly from `api.github.com` with six-hour caching keeps the marketing page live-updated without introducing a proxy service.
  Rate limiting risk is mitigated via optional build-time tokens and a "100+ Stars" fallback badge that preserves social proof even when the API is unreachable.
- **Feature Flags + Content Config Modules:** Hero copy, feature cards, and external links are centralized in typed config files with boolean flags controlling experimental elements like enhanced animations.
  This keeps marketing iterations in source control and prevents unfinished modules from leaking into production builds.
- **Observability-First Instrumentation:** Clipboard success, doc clicks, and star fetch outcomes emit structured logs and optionally hit PostHog via `trackEvent`, giving the team visibility without standing up a backend.
  The trade-off is minor client overhead, but batching with `sendBeacon` keeps the performance budget intact.

<!-- anchor: 4-2-alternatives-considered -->
### 4.2. Alternatives Considered

- **Next.js SSR/ISR:** Server-rendered pages could have offered dynamic personalization, yet they would increase operational complexity and cold-start latency for zero gain on a static marketing page.
  The SPA route avoids server runtimes entirely, aligning with the foundation's CDN-first directive.
- **No-Code Marketing Platforms:** Tools like Webflow or Framer were considered for rapid iteration, but they cannot guarantee the Aura theme precision, bespoke glassmorphism, or clipboard/analytics instrumentation required.
  Owning the React codebase ensures feature flags, GitHub API usage, and Docker parity stay under engineering control.

<!-- anchor: 4-3-known-risks-and-mitigation -->
### 4.3. Known Risks & Mitigation

- **GitHub API Instability:** Rate limits or outages could hide the social proof; caching results in `localStorage`, logging failures, and showing "100+ Stars" keeps the UI stable while alerting operators.
- **Clipboard Permission Denials:** Browser restrictions may block `navigator.clipboard`, so the fallback text selection and aria-live toast confirm success without frustrating the user journey.
- **Visual Regression Drift:** Premium visuals demand consistency; automated screenshot diffs plus Tailwind token centralization decrease the chance of regressions, and rollbacks on Vercel provide a quick escape hatch.
- **Bundle Bloat:** Adding animations or icons could breach the 200KB target; strict lint rules, `bundlesize` checks, and tree-shaken Lucide imports enforce the budget.

<!-- anchor: 5-0-future-considerations -->
## 5. Future Considerations

The current scope meets launch goals, yet several evolutions could amplify the story without violating the small-scale directive.

<!-- anchor: 5-1-potential-evolution -->
### 5.1. Potential Evolution

- **Edge-Rendered Metrics Widget:** If marketing needs more social proof, a tiny Vercel Edge Function could prefetch stars and contributors, still respecting static delivery but reducing client fetches even further.
- **Interactive Workflow Playback:** Embedding a lightweight WASM/terminal recorder would let visitors scrub through a real CodeMachine run, toggled via a feature flag to keep the base experience lean.
- **Localized Copy Packs:** Config-driven translations could be added by expanding the content module schema, enabling region-specific hero text without touching the layout code.

<!-- anchor: 5-2-areas-for-deeper-dive -->
### 5.2. Areas for Deeper Dive

- **CI/CD Hardening:** A fuller blueprint of GitHub Actions (cache strategy, artifact retention, security scanning) would future-proof the pipeline as more contributors join.
- **Analytics Governance:** Defining consent flows, event schema versioning, and retention policies would ensure telemetry remains privacy-safe while still actionable.
- **A/B Experimentation:** Documenting how feature flags map to experiments (naming conventions, rollout procedures) would make future split tests repeatable.

<!-- anchor: 6-0-glossary -->
## 6. Glossary

- **Aura Theme:** The specified dark-mode design language featuring neutral-950 bases, indigo accents, noise textures, and glassmorphism cards.
- **ExperienceShell:** The layout layer that renders the background glows, nav bar, and structural wrappers that every section plugs into.
- **IntegrationStatusBar:** The component responsible for fetching and displaying GitHub stars with retries, caching, and fallback text.
- **Feature Flag:** A boolean defined in `flags.ts` (and optionally wired to environment variables) that gates new UI variants without code removal.
- **Vercel Edge Network:** The CDN and hosting platform delivering the static SPA worldwide with automatic TLS, previews, and rollbacks.
