<!-- anchor: 3-0-proposed-architecture -->
## 3. Proposed Architecture (Behavioral View)

*   **3.7. API Design & Communication:**
    *   **API Style:** RESTful GET requests orchestrate integration with GitHub REST v3 while all other data is loaded from static config modules packaged by Vite.
        This approach honors the small-scale directive by avoiding custom backend endpoints yet still enabling live telemetry for the IntegrationStatusBar.
        Requests are initiated by IntegrationStatusBar with headers derived from environment-driven flags emitted by ExperienceShell, keeping authentication optional but pluggable.
        Responses are cached in ContentConfigModule for six hours and logged through console.info/console.warn so deployment diagnostics remain lightweight.
        Rate limiting is mitigated by deferring live fetches via `requestIdleCallback` until IntegrationStatusBar enters the viewport, which protects the slow-fade hero animation from blocking work.
        A lightweight retry-with-timeout loop (max two attempts) keeps all traffic inside the browser event loop and avoids introducing background workers that would violate the static hosting constraint.
        ExperienceShell supplies feature flags such as `enableLiveStars` from `flags.ts`, allowing demo builds to short-circuit the network call entirely while maintaining the same DTO shape for deterministic rendering.
        When the fetch pipeline detects `403` rate limits, IntegrationStatusBar logs a structured warning and immediately requests a fallback copy from ContentConfigModule rather than retrying indefinitely.

    *   **Communication Patterns:** ExperienceShell bootstraps hydration by requesting typed payloads from ContentConfigModule, then instantiates HeroCommandPanel, VisualSimulationWindow, FeatureBentoGrid, and IntegrationStatusBar with the returned props.
        HeroCommandPanel exposes clipboard and CTA telemetry via ExperienceShell's shared analytics helper, enabling consistent console logging and optional PostHog forwarding without duplicating logic.
        IntegrationStatusBar performs asynchronous GitHub fetches and resolves star counts back to HeroCommandPanel via prop updates while also persisting counts through ContentConfigModule to honor the fallback requirements.
        FeatureBentoGrid registers IntersectionObserver hooks seeded by ExperienceShell, publishing reveal-complete events back to the shell so further animations (like VisualSimulationWindow pulsing) only fire once the grid is visible.
        VisualSimulationWindow consumes responsive state from ExperienceShell, collapsing to a static illustration below md breakpoints while continuing to emit status events (e.g., fade completion) for analytics consistency.
        All asynchronous handlers emit console-level observability records, and each external link interaction funnels through ExperienceShell to enforce security headers and rel attributes.
        Docs and GitHub CTAs propagate through ExperienceShell, which attaches `rel="noopener noreferrer"` and logs `trackEvent('external_click', { location })` so downstream analytics can reconcile navigation funnels.
        Clipboard fallbacks span a promise rejection path where HeroCommandPanel requests ExperienceShell to highlight the command text, while IntegrationStatusBar remains idle to avoid jitter during the user interaction.
        When viewport width crosses the `md` breakpoint, ExperienceShell emits a `visualWindowMode` change event so VisualSimulationWindow can disable heavy gradients and FeatureBentoGrid can switch to a single-column layout without rerunning content queries.
        ExperienceShell also brokers ambient background state by passing `VisualAsset` definitions into child layers, keeping z-index coordination centralized and preventing conflicting CSS across modules.
        ContentConfigModule doubles as a thin client-side cache for IntegrationStatusBar and FeatureBentoGrid; each write funnels through a shared helper that timestamps entries for observability and respects the six-hour expiry window.
        DeploymentPipeline artifacts (lint, type-check, visual regression) feed back into ExperienceShell configuration via environment variables, letting runtime components adapt (e.g., disable shimmering) when CI detects anomalies.
        Scroll-triggered fades rely on IntersectionObserver callbacks that ExperienceShell registers once and distributes via context, ensuring FeatureBentoGrid and IntegrationStatusBar reuse the same observer without redundant listeners.
        VisualSimulationWindow acknowledges completion events through ExperienceShell so that IntegrationStatusBar can delay updating star badges until the hero animation has stabilized.
        HeroCommandPanel exposes focus-visible states to ExperienceShell, which coordinates outline styles with the global Tailwind tokens to preserve accessibility even when additional agents later manipulate the DOM.
        IntegrationStatusBar publishes `starMetricUpdated` events through the shell, allowing optional secondary widgets (e.g., nav badge) to subscribe without polling or tight coupling.
        Clipboard-related analytics bubble up as discrete events, letting ContentConfigModule augment them with contextual metadata (browser hints, locale) before persistence or forwarding.

    *   **Key Interaction Flow (Sequence Diagram):**
        *   **Description:** Diagram captures Journey 1 (First-Time Installation) plus the supporting GitHub proof fetch, showing how ExperienceShell, HeroCommandPanel, IntegrationStatusBar, VisualSimulationWindow, FeatureBentoGrid, and ContentConfigModule coordinate to deliver clipboard success, fallbacks, and responsive transitions.
        The flow also foregrounds observability touchpoints because every async success or failure logs via ExperienceShell before control returns to the user-facing component.
        It further illustrates how caching short-circuits repeat fetches: IntegrationStatusBar never blocks hero rendering if ContentConfigModule already owns a valid `StarMetric`.
        By keeping every arrow inside the SPA boundary, the flow highlights why additional services (queues, workers) are unnecessary for this release.
        *   **Diagram (PlantUML):**
            ~~~plantuml
            @startuml
            actor User
            participant ExperienceShell
            participant ContentConfigModule
            participant HeroCommandPanel
            participant IntegrationStatusBar
            participant VisualSimulationWindow
            participant FeatureBentoGrid

            User -> ExperienceShell: Load codemachine.co
            ExperienceShell -> ContentConfigModule: hydrateVisualAssets()
            ContentConfigModule --> ExperienceShell: heroContent, featureCards, externalLinks
            ExperienceShell -> HeroCommandPanel: mountHero(heroContent)
            HeroCommandPanel -> IntegrationStatusBar: requestStarMetric()
            IntegrationStatusBar -> ContentConfigModule: readCachedStarMetric()
            alt cacheValid
            ContentConfigModule --> IntegrationStatusBar: cachedStarMetric
            IntegrationStatusBar -> HeroCommandPanel: renderStarBadge(count)
            else cacheExpired
            IntegrationStatusBar -> ExperienceShell: requestGithubEnv()
            ExperienceShell --> IntegrationStatusBar: publicHeaders + flags
            IntegrationStatusBar -> IntegrationStatusBar: fetch GitHub REST /repos
            alt fetchSuccess
            IntegrationStatusBar -> HeroCommandPanel: updateStarBadge(newCount)
            IntegrationStatusBar -> ContentConfigModule: persistStarMetric(newCount, timestamp)
            else fetchFailure
            IntegrationStatusBar -> ContentConfigModule: requestFallbackCopy()
            ContentConfigModule --> IntegrationStatusBar: "100+ Stars"
            IntegrationStatusBar -> HeroCommandPanel: renderFallbackStarBadge()
            end
            end
            User -> HeroCommandPanel: Press copy command
            HeroCommandPanel -> ExperienceShell: navigator.clipboard.writeText()
            alt clipboardAllowed
            ExperienceShell --> HeroCommandPanel: resolve promise
            HeroCommandPanel -> ExperienceShell: trackEvent("copy_success")
            HeroCommandPanel -> User: show check icon + aria-live toast
            else clipboardDenied
            ExperienceShell --> HeroCommandPanel: reject promise
            HeroCommandPanel -> ExperienceShell: selectTextFallback()
            HeroCommandPanel -> ExperienceShell: trackEvent("copy_fallback")
            end
            User -> ExperienceShell: Scroll to features
            ExperienceShell -> VisualSimulationWindow: toggleMobileCollapse(<md)
            ExperienceShell -> FeatureBentoGrid: triggerRevealAnimation()
            FeatureBentoGrid -> ExperienceShell: confirmRevealComplete
            @enduml
            ~~~
        Diagram confirms that ExperienceShell orchestrates both synchronous configuration reads and asynchronous clipboard or fetch handling without leaking responsibilities to individual components.
        The alt branches document fallback sequences in-line, satisfying the requirement that clipboard failures and GitHub unavailability still yield deterministic user feedback.
        Emphasizing these splits at the behavioral level ensures the Structural_Data_Architect can wire props and hooks knowing exactly which component sends or awaits each message.

    *   **Data Transfer Objects (DTOs):** HeroCommandPanel receives a `HeroContent` DTO with `headline`, `subheadline`, `install_command`, `start_command`, `beta_label`, and `cta_link`; the object is injected once during hydration and re-used for clipboard fallbacks so no re-render storms occur.
        IntegrationStatusBar exchanges a `StarMetric` DTO shaped as `{ label: string; count: number; timestamp: string; fallbackCopy: string }`, enabling cache validation and fallback copy in one payload, while logs include the timestamp for observability.
        FeatureBentoGrid consumes an array of `FeatureCard` DTOs containing `id`, `title`, `description`, `icon`, optional `grid_span`, and `accentGlow`, which the component maps onto responsive CSS classes before publishing reveal events back to ExperienceShell.
        External link CTAs share a unified `ExternalLink` DTO with `label`, `url`, `icon`, `location`, and `newTab`, ensuring nav, hero, and footer interactions all inherit the same security attributes when ExperienceShell orchestrates the click.
        Visual layers rely on `VisualAsset` DTOs (`{ id, type, opacity, blendMode, zIndex }`), enabling ExperienceShell to paint the ambient glows, noise overlay, and subtle grid in a deterministic stacking order that matches the Aura spec.
        Clipboard confirmations emit an analytics payload `{ action: 'copy_install', status: 'success' | 'fallback', timestamp }`, which ExperienceShell may forward to a PostHog endpoint after logging locally.
        Async fetch instrumentation stores `{ context: 'github-stars', attempt: number, duration: number }` inside ContentConfigModule so IntegrationStatusBar can surface performance issues before rate limits escalate.
        Any feature experimentation is wrapped behind `flags.ts`, where DTOs add a boolean `enabled` field to gate future hero simulations without disturbing current deployments.
        Collectively, these DTOs keep the SPA deterministic because each component consumes typed props and only mutates state through the shared config/cache helpers defined by the foundation blueprint.
        HeroCommandPanel additionally loads a lightweight `CommandAction` DTO `{ install: string; start: string; checksum?: string }`, allowing the same component to render quick-start instructions beyond installation without altering copy logic.
        IntegrationStatusBar caches serialized DTOs in `localStorage` using the namespace `codemachine:metric:<id>`, and ContentConfigModule exposes helper methods to deserialize them safely across reloads.
        FeatureBentoGrid reveal observers emit `{ featureId, revealedAt, durationMs }` events, which ExperienceShell can aggregate for future personalization experiments.
        VisualSimulationWindow ingests a `SimulationScript` DTO describing panes, logs, and highlight timings so multiple demo narratives can play without editing component internals.
        ExternalLink DTOs also carry `ariaLabel` when needed, ensuring nav icons remain accessible even in condensed mobile layouts.
