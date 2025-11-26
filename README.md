<!-- anchor: project-plan-root -->
<!-- anchor: project-overview -->
# CodeMachine Landing Page

[![pnpm](https://img.shields.io/badge/pnpm-9.0.0-yellow.svg)](https://pnpm.io/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com)
[![Install](https://img.shields.io/badge/install-npm%20install-d97706.svg?logo=npm&logoColor=white)](#-quick-start)
[![Dev Server](https://img.shields.io/badge/dev-pnpm%20run%20dev-6366f1.svg?logo=vite&logoColor=white)](#-quick-start)
[![Artifacts](https://img.shields.io/badge/docs-architecture%20artifacts-9333ea.svg?logo=mermaid&logoColor=white)](#architectural-artifacts)
[![Iteration](https://img.shields.io/badge/iteration-I3%20%E2%80%94%20Complete-0ea5e9.svg)](#current-iteration-status)

> Autonomous AI agents for your codebase - Experience the future of development with intelligent, context-aware automation.

## 🤖 Built by CodeMachine

**This entire landing page was autonomously created by CodeMachine** - a testament to the future of AI-driven software development. From initial concept to production-ready deployment, CodeMachine architected, implemented, and tested every layer of this application without human intervention.

### The Numbers Tell the Story

**87% of this codebase is production-grade infrastructure built 100% autonomously by CodeMachine.**

Out of 4,519 lines of production code:
- **3,917 lines (86.7%)**: Fully autonomous - architecture, business logic, tests, CI/CD, accessibility
- **602 lines (13.3%)**: Single vibecoded commit for terminal aesthetic refinements

**Autonomous Development Timeline:**
- **83 AI agents** executed (73 successful, 10 rate-limited retries)
- **4.3 hours** of active development time
- **13.4 hour** total span (1:44 AM → 3:07 PM on Nov 22, 2025)
- **8.5 hours** idle (rate limit cooldowns, waiting periods)
- **~4.9 hours** of actual productive autonomous work

CodeMachine built this entire production-grade application in **less than 5 hours of active work** - what would typically take a development team days or weeks.

### Multi-Engine Orchestration

CodeMachine doesn't rely on a single AI model - it orchestrates **multiple specialized engines**, each optimized for different phases of development:

| Engine | Model | Agents | Role |
|--------|-------|--------|------|
| **Codex** (OpenAI) | gpt-5-codex (reasoning: medium) | 51 (61%) | Planning & Architecture |
| **Claude** (Anthropic) | Sonnet 4.5 | 19 (23%) | Code Generation |
| **Cursor** | GPT-4.1 | 13 (16%) | Utilities & Git Operations |

**Engine-to-Agent Mapping:**

<details>
<summary><strong>🧠 Codex (51 agents) — Planning & Architecture</strong></summary>

Codex handled the strategic thinking and project orchestration:
- `init` (1) — Project initialization and workspace setup
- `principal-analyst` (1) — Requirements analysis and scope definition
- `founder-architect` (1) — High-level system architecture
- `structural-data-architect` (1) — Data models and type system design
- `behavior-architect` (1) — Component behavior and interaction patterns
- `operational-architect` (1) — CI/CD and deployment architecture
- `ui-ux-architect` (1) — Design system and user experience planning
- `file-assembler` (1) — File structure and module organization
- `blueprint-orchestrator` (1) — Cross-cutting concerns coordination
- `plan-agent` (1) — Task planning and dependency resolution
- `task-breakdown` (1) — Breaking epics into actionable tasks
- `context-manager` (12) — Maintaining project context across agents
- `check-task` (12) — Task validation and completion verification
- `task-sanity-check` (13) — Quality gates and sanity validation
- `code-generation` (4) — Strategic code scaffolding

</details>

<details>
<summary><strong>✨ Claude (19 agents) — Code Generation</strong></summary>

Claude handled the heavy-lifting implementation work:
- `code-generation` (17) — Core implementation of components, hooks, utilities
- `principal-analyst` (1) — Deep code analysis
- `runtime-prep` (1) — Runtime environment configuration

</details>

<details>
<summary><strong>⚡ Cursor (13 agents) — Utilities & Git Operations</strong></summary>

Cursor handled rapid iteration and version control:
- `git-commit` (13) — Atomic commits with semantic messages

</details>

**Why Multi-Engine?**
- **Codex** excels at planning, reasoning about architecture, and orchestrating complex workflows
- **Claude** delivers high-quality, production-ready code with strong typing and best practices
- **Cursor** provides fast, lightweight operations for git and utility tasks

This multi-engine approach mirrors how senior engineering teams work: architects plan, developers implement, and tooling automates the repetitive tasks.

### Token Economics

Total tokens consumed across all 83 agents:

| Engine | Input Tokens | Output Tokens | Cached | Total |
|--------|-------------|---------------|--------|-------|
| **Codex** | 79.3M | 569K | 35.9M | 79.9M |
| **Claude** | 12.0M | 164K | 12.0M | 12.2M |
| **Cursor** | — | — | — | Free |
| **Total** | **91.3M** | **733K** | **47.9M** | **92.1M** |

**Cost Analysis:**
- **Codex**: OpenAI Teams subscription — hit rate limit once (~5hr cooldown)
- **Claude**: Anthropic Pro account — hit rate limit once (~5hr cooldown)
- **Cursor**: Free tier — no token costs for git operations
- **Total wait time**: ~5 hours (both engines hit rate limits simultaneously)

**Efficiency Insights:**
- **52% cache hit rate** (47.9M of 91.3M input tokens) — CodeMachine's context management reuses prior work
- **Output efficiency**: Only 733K tokens generated from 91.3M input — focused, precise code generation
- **Resilient workflow**: Rate limits gracefully handled with automatic queuing and retry

### What CodeMachine Built Autonomously

The autonomous agent didn't just generate boilerplate - it architected and implemented production-grade systems:

**Core Architecture (100% Autonomous)**
- Complete React 18 + TypeScript application with strict type safety
- Modular component architecture with separation of concerns
- Custom hook system (`useGitHubStars`, `useClipboardCommand`, `useCursorGlow`)
- Advanced caching layer with 6-hour TTL and localStorage persistence
- Retry logic with exponential backoff for API resilience

**Developer Experience (100% Autonomous)**
- Comprehensive test suite: 1,061 lines covering unit and E2E scenarios
- GitHub Actions CI/CD pipeline with automated quality gates
- Docker multi-stage builds optimized for production
- Vite bundler configuration with code splitting
- ESLint + Prettier with strict rules
- TypeScript configuration with path aliases

**Production Features (100% Autonomous)**
- Feature flag system for controlled rollouts
- Analytics integration with event tracking
- Accessibility: ARIA labels, keyboard navigation, reduced motion support
- Error boundaries and graceful fallbacks
- Rate limit handling for GitHub API (60/hr unauthenticated, 5k/hr with token)
- Performance optimizations: lazy loading, requestIdleCallback, code splitting

**Infrastructure (100% Autonomous)**
- Deployment configs for Vercel and Netlify
- Environment variable management
- Security headers (HSTS, X-Content-Type-Options)
- Responsive design system with Tailwind CSS
- Glass-morphic UI components with ambient effects

### The Vibecoded 13%: Proof of Solid Foundations

The terminal-themed redesign represents a **single commit** that modified visual elements only - yet it integrated seamlessly because CodeMachine's architecture was production-ready:

- Changed color scheme from purple/indigo to cyan/green
- Added animated background with geometric effects
- Redesigned hero section with ASCII art
- Updated component styling to match terminal aesthetic

**These changes took minutes to implement** - not because the redesign was trivial, but because the underlying architecture (routing, state management, caching, analytics, accessibility) was already production-grade. The vibecoded commit didn't touch core business logic, didn't modify the test suite, and didn't break CI/CD - it simply painted a new skin over battle-tested infrastructure.

### Why This Matters

This project demonstrates that AI agents can now:
1. **Architect production systems** - not just generate code snippets
2. **Make architectural decisions** - caching strategies, error handling, performance optimizations
3. **Implement best practices** - testing, CI/CD, accessibility, security
4. **Build for scale** - rate limiting, retry logic, feature flags, monitoring

The 87/13 split proves CodeMachine can autonomously deliver production-grade applications, with human creativity reserved for the final aesthetic polish.

## 🎯 Project Overview

This is the landing page for CodeMachine, built with modern web technologies and featuring the **Aura design system** - a sophisticated dark theme with glassmorphic UI elements, ambient glows, and subtle noise textures.

### Technology Stack

- **Frontend:** React 18 with TypeScript 5.3, Vite 5 bundler
- **Styling:** Tailwind CSS 3.4 with custom Aura theme tokens
- **Icons:** Lucide React (tree-shakeable icon library)
- **Package Manager:** pnpm 9.0.0 (frozen lockfile for CI parity)
- **Backend:** None (static SPA with client-side GitHub API integration)
- **Database:** None (content lives in typed `src/content/*.ts` modules)
- **Deployment:** Vercel (primary) or Netlify, Docker multi-stage builds (node:20-alpine)
- **Testing:** Playwright (E2E stubs), Vitest (unit stubs), Lighthouse (CI verification)
- **Key Libraries:** clsx/tailwind-merge (utility composition), optional Framer Motion (future animations)

<!-- anchor: iteration-overview -->
### Current Iteration Status

**Iteration I3 (Feature grid & docs):** ✅ Complete
- Task I3.T1: FeatureBentoGrid + supporting content blocks ✅
- Task I3.T2: Journey/verification docs for remaining flows ✅
- Task I3.T3: Deployment + telemetry experiments ✅

**Iteration I2 (Telemetry Experience):** ✅ Complete
- Task I2.T1: HeroCommandPanel + clipboard interactions ✅
- Task I2.T2: VisualSimulationWindow desktop/mobile variants ✅
- Task I2.T3: IntegrationStatusBar + GitHub spec ✅
- Task I2.T4: Accessibility polish + analytics instrumentation ✅

**Iteration I1 (Foundation):** ✅ Complete
- Task I1.T1: React + Tailwind workspace with Aura theming ✅
- Task I1.T2: Typed content models and ERD diagram ✅
- Task I1.T3: ExperienceShell architecture with contexts ✅
- Task I1.T4: README and component diagram ✅

<!-- anchor: getting-started -->
## 🚀 Quick Start

### Prerequisites

- **Node.js:** 20.x or higher (LTS recommended for stability)
- **pnpm:** 9.0.0 or higher (`npm install -g pnpm@9.0.0`)
- **Git:** For cloning the repository

### Installation & Development

```bash
# 1. Clone the repository
git clone https://github.com/moazbuilds/CodeMachine-Website.git
cd CodeMachine-Website

# 2. Install dependencies (uses frozen lockfile for reproducibility)
pnpm install

# 3. Start development server with hot module replacement
pnpm run dev

# 4. Open browser at http://localhost:3000
# Dev server runs on port 3000 with host access enabled
```

> Prefer pnpm for deterministic installs. If pnpm is unavailable, run `npm install` (Corepack-enabled) to hydrate `node_modules`, then continue with the same dev scripts.

### Available Scripts

```bash
# Development
pnpm run dev          # Start Vite dev server with HMR

# Production
pnpm run build        # Type-check and build for production
pnpm run preview      # Preview production build locally

# Code Quality
pnpm run lint         # Run ESLint
pnpm run format       # Format code with Prettier

# Testing
pnpm run test:unit    # Vitest hooks + utility specs
pnpm run test:e2e     # Playwright journeys (headless)
pnpm run test:e2e:ui  # Playwright UI runner for debugging

# Performance
pnpm run test:perf    # Lighthouse CI budgets
pnpm run analyze      # Bundle analyzer (Vite visualizer)
```

<!-- anchor: deployment -->
## 🚢 Deployment & Delivery

### GitHub Actions CI

- Automated via [`ci.yml`](.github/workflows/ci.yml) which runs `pnpm install --frozen-lockfile`, lint, unit, Playwright, build, and Lighthouse gates on pushes + PRs to `main`.
- Playwright browsers are installed with `pnpm exec playwright install --with-deps`; set `PLAYWRIGHT_BROWSERS_PATH=0` locally to mirror CI caching.
- Debug workflow issues locally with [`act`](https://github.com/nektos/act): `act pull_request -j quality`.

### Vercel (Primary)

1. Authenticate: `vercel login` then `vercel link`.
2. Pull env + project settings: `vercel pull --yes --environment=preview`.
3. Build locally using repo config: `vercel build` (driven by [`vercel.json`](vercel.json)).
4. Deploy: `vercel deploy --prebuilt` for previews; `vercel deploy --prebuilt --prod` once CI is green.

### Netlify (Fallback)

1. Install CLI: `npm i -g netlify-cli`.
2. Link site: `netlify link`.
3. Deploy via [`netlify.toml`](netlify.toml):
   - Preview: `netlify deploy --build --message "preview"`.
   - Production: `netlify deploy --prod`.
4. Verify response headers match config (HSTS + `X-Content-Type-Options`).

### Docker / Local Parity

Use the [Docker Support](#-docker-support) steps for parity builds. CI and hosting configs assume Node 20 + pnpm 9; keep Docker images updated to avoid drift.

<!-- anchor: core-architecture -->
## 🏗️ Architecture & Component Overview

This project follows a **static React shell** architecture where all visual modules consume typed content models and expose explicit props. The ExperienceShell orchestrates layout, theming, and navigation while delegating section-specific rendering to specialized components.

### Key Components & Responsibilities

| Component | Responsibility | File Path | Status |
|-----------|---------------|-----------|--------|
| **ExperienceShell** | Wraps layout, background layers, ambient glows, sticky navigation; enforces Aura theming and provides context providers | `src/components/ExperienceShell/index.tsx` | ✅ Implemented |
| **NavigationBar** | Sticky header with doc/GitHub links, logo, and scroll-aware behavior | `src/components/NavigationBar/index.tsx` | ✅ Implemented |
| **BackgroundLayers** | Renders noise textures and ambient gradient glows for Aura aesthetic | `src/components/ExperienceShell/BackgroundLayers.tsx` | ✅ Implemented |
| **FeatureFlagProvider** | Context provider for feature toggles (seeds from `@/content/flags`) | `src/components/ExperienceShell/FeatureFlagContext.tsx` | ✅ Implemented |
| **ScrollRevealProvider** | Context for scroll-triggered animations (placeholder for future IntersectionObserver logic) | `src/components/ExperienceShell/ScrollRevealContext.tsx` | ✅ Implemented |
| **HeroCommandPanel** | Headline, command snippet, copy-to-clipboard control, documentation CTA | `src/components/HeroCommandPanel/` | ✅ Implemented (I2.T1) |
| **VisualSimulationWindow** | Glassmorphic terminal mockup with animations, fallback static image for mobile | `src/components/VisualSimulationWindow/` | ✅ Implemented (I2.T2) |
| **FeatureBentoGrid** | Responsive grid of feature cards with hover glows and scroll observers | `src/components/FeatureBentoGrid/` | ⏳ Planned (I2+) |
| **IntegrationStatusBar** | GitHub star count fetcher with retries, skeleton state, fallback badge | `src/components/IntegrationStatusBar/` | ✅ Implemented (I2.T3) |
| **ContentConfigModule** | Centralizes typed content (`HeroContent`, `FeatureCard`, `ExternalLink`, flags) | `src/content/index.ts` | ✅ Implemented |

### Content System & Data Flow

All content is defined as **typed TypeScript modules** in `src/content/`, ensuring compile-time validation and deterministic builds:

- **`@/content/hero`** → Exports `heroContent: HeroContent` with headline, description, install command, and CTAs
- **`@/content/features`** → Exports `featureCards: FeatureCard[]` and `visualAssets: VisualAsset[]` for bento grid rendering
- **`@/content/links`** → Exports `externalLinks: ExternalLink[]`, `starMetrics: StarMetric[]`, and GitHub helpers
- **`@/content/flags`** → Exports `featureFlags: Record<string, FeatureFlag>` and `isFeatureEnabled()` helper
- **`@/content/types`** → Defines all TypeScript interfaces (`HeroContent`, `FeatureCard`, `IconKey`, etc.)

Components consume this data via the barrel export `@/content/index.ts`, never importing directly from individual modules. This ensures a single source of truth and simplifies refactoring.

### Feature Flag Usage

Feature flags are defined in `src/content/flags.ts` and accessed via the `FeatureFlagProvider` context:

```tsx
import { useFeatureFlags } from '@/components/ExperienceShell/FeatureFlagContext'

function MyComponent() {
  const { isEnabled } = useFeatureFlags()

  return (
    <>
      {isEnabled('clipboardInteractions') && <CopyButton />}
      {isEnabled('enableGithubStars') && <StarCount />}
    </>
  )
}
```

To toggle a flag, edit `src/content/flags.ts`:

```typescript
export const featureFlags: readonly FeatureFlag[] = [
  {
    key: 'enableGithubStars',
    description: 'Fetch GitHub stars for telemetry badge.',
    enabled: false,
  },
  {
    key: 'clipboardInteractions',
    description: 'Allow HeroCommandPanel copy-to-clipboard action.',
    enabled: true,
  },
] as const
```

<!-- anchor: artifact-pointers -->
### Architectural Artifacts

This project maintains living architectural documentation:

- **[Component Diagram](docs/diagrams/component_overview.mmd)** (Mermaid) — Visualizes ExperienceShell, section modules, content flow, and hook relationships
- **[Data Model ERD](docs/diagrams/data_model_erd.puml)** (PlantUML) — Captures typed content entities and their relationships
- **[Journey Sequence Diagram](docs/diagrams/journey_install_sequence.puml)** (PlantUML) — Documents the hero → copy → telemetry flow
- **[GitHub Integration Spec](api/github_star_fetch.md)** (Markdown) — Defines API contract, caching, fallback semantics
- **[Verification Checklist](docs/adr/verification_checklist.md)** (Markdown) — CI, Lighthouse, Playwright, and deployment gates for releases

## 🎨 Aura Design System

The Aura theme provides a premium, futuristic aesthetic with the following features:

### Color Palette

- **Neutrals:** True-black backgrounds (`#000000`, `#0a0a0a`) with subtle variations
- **Primary:** Indigo/purple gradient (`#8b5cf6`, `#7c3aed`, `#a78bfa`)
- **Accents:** Blue (`#3b82f6`) and Emerald (`#34d399`) for status indicators
- **Glass Borders:** `rgba(255,255,255,0.08)` for subtle separation

### Typography

- **Sans:** Inter (300-700 weights) for UI text
- **Mono:** JetBrains Mono for code and telemetry
- **Scale:** Responsive from 12px to 72px with optimized line heights

### Key Components

- **Glass Card:** Translucent surfaces with backdrop blur
- **Ambient Glows:** Radial gradients with screen blend mode
- **Noise Overlay:** SVG fractal texture at 3% opacity
- **Custom Animations:** `fade-up`, `pulse-slow`, `shimmer`

### Tailwind Utilities

```tsx
// Glass morphism
<div className="glass-card rounded-xl p-6">

// Text with gradient
<h1 className="text-gradient-primary">

// Focus states
<button className="focus-ring-aura">

// Ambient decorations
<div className="ambient-glow w-96 h-96 bg-primary-600/20">
```

## 📁 Project Structure

```
codemachine-landing/
├── .codemachine/            # CodeMachine agent workspace artifacts
│   ├── agents/              # Agent configurations and state
│   ├── artifacts/           # Generated diagrams and documents
│   ├── inputs/              # Agent input files
│   ├── logs/                # Execution logs
│   ├── memory/              # Agent memory and context
│   ├── prompts/             # Custom prompts and templates
│   ├── scripts/             # Automation scripts
│   └── template.json        # CodeMachine configuration template
├── .github/
│   └── workflows/
│       └── ci.yml           # CI/CD pipeline configuration
├── src/
│   ├── components/
│   │   ├── ExperienceShell/
│   │   ├── HeroCommandPanel/
│   │   ├── VisualSimulationWindow/
│   │   ├── FeatureBentoGrid/
│   │   └── IntegrationStatusBar/
│   ├── content/
│   │   ├── index.ts         # Typed hero + feature manifests
│   │   └── types.ts         # Shared data contracts
│   ├── hooks/               # useClipboardCommand/useGitHubStars stubs
│   ├── lib/
│   │   └── utils.ts         # Tailwind class merge utility
│   ├── styles/              # Additional Aura partials (future)
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React entry point
│   └── index.css            # Tailwind directives + Aura styles
├── public/
│   ├── index.html           # Lighthouse-friendly HTML shell (mirrors root)
│   ├── textures/noise.svg   # Base Aura noise texture
│   └── vite.svg             # Favicon placeholder
├── docs/
│   ├── diagrams/            # Mermaid + PlantUML sources
│   └── adr/                 # Architecture decision records
├── api/                     # Markdown specs for integrations
├── tests/
│   ├── e2e/                 # Playwright smoke stubs
│   └── unit/                # Vitest spec stubs
├── tools/                   # Build and development utilities
│   ├── generate_mobile_sim.py  # Mobile simulation generator
│   ├── install.cjs          # Custom install script
│   ├── lint.cjs             # Linting utilities
│   ├── run.cjs              # Task runner
│   └── test.cjs             # Test utilities
├── index.html               # HTML entry with fonts and meta tags
├── tailwind.config.ts       # Aura theme configuration
├── vite.config.ts           # Vite bundler settings
├── tsconfig.json            # TypeScript compiler options
├── postcss.config.cjs       # PostCSS with Tailwind + Autoprefixer
├── Dockerfile               # Multi-stage production build
└── package.json             # Dependencies and scripts
```

## 🐳 Docker Support

The project includes a multi-stage Dockerfile optimized for production deployments:

```bash
# Build production image
docker build -t codemachine-landing .

# Run container
docker run -p 8080:80 codemachine-landing

# Development mode (with hot reload)
docker build --target development -t codemachine-dev .
docker run -p 3000:3000 -v $(pwd):/app codemachine-dev
```

### Docker Stages

1. **Base:** Node 20 Alpine with system dependencies and pnpm
2. **Dependencies:** Install packages with frozen lockfile
3. **Builder:** Run TypeScript compilation and Vite build
4. **Production:** Nginx Alpine serving static assets
5. **Development:** Hot-reload dev server (optional target)

## 🎯 Acceptance Criteria (Task I1.T1)

- ✅ `pnpm build` succeeds without errors
- ✅ Tailwind config exposes `neutral` and `primary` color tokens
- ✅ Custom animations (`fade-up`, `pulse-slow`, `shimmer`) configured
- ✅ HTML loads Inter and JetBrains Mono fonts from Google Fonts
- ✅ Noise overlay applied globally via inline CSS
- ✅ Directory structure matches architectural plan
- ✅ Dockerfile runs `pnpm build` on node:20-alpine without extra flags
- ✅ Lucide icons imported and tree-shaking verified

## 🔧 Configuration Highlights

### Vite Configuration

- **Alias:** `@/` → `./src/` for clean imports
- **Code Splitting:** Vendor chunk (React/React-DOM) and icons chunk (Lucide)
- **Dev Server:** Port 3000 with host access enabled
- **Build:** Sourcemaps enabled for debugging

### TypeScript Configuration

- **Strict Mode:** Enabled for maximum type safety
- **JSX:** React 18 automatic runtime (`react-jsx`)
- **Path Mapping:** `@/*` resolves to `src/*`
- **Types:** Includes `vite/client` for asset imports

### Tailwind Configuration

- **Content Paths:** `src/**/*.{ts,tsx}`, `docs/**/*.{md,mmd}`
- **Custom Plugin:** Adds `.glass-card`, `.text-glow`, `.focus-ring`, `.inner-glow` utilities
- **Extended Theme:** Custom spacing, colors, fonts, animations, and keyframes

<!-- anchor: env-variables -->
## 🔐 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_GITHUB_TOKEN` | Optional (recommended for CI/Prod) | _unset_ | Personal access token for GitHub star fetches; prevents 60/hr unauthenticated limit. |
| `VITE_GITHUB_STARS_TTL_HOURS` | No | `6` | Overrides cache TTL for GitHub metrics (must be positive integer). |
| `VITE_ANALYTICS_ENDPOINT` | Optional | _unset_ | PostHog (or compatible) endpoint to receive Aura analytics events. |
| `PLAYWRIGHT_BROWSERS_PATH` | CI only | `0` | Ensures browsers install inside workspace for cache hits during CI. |

Create `.env.local` (ignored by git) for local development:

```bash
touch .env.local
echo "VITE_GITHUB_TOKEN=ghp_example" >> .env.local
echo "VITE_ANALYTICS_ENDPOINT=https://posthog.example.com/capture" >> .env.local
```

> Hosting configs inherit these variables: see [`vercel.json`](vercel.json) secrets mapping and `[build.environment]` inside [`netlify.toml`](netlify.toml).

<!-- anchor: troubleshooting -->
## 🔧 Troubleshooting

### CI / Deployment Issues

- **Workflow fails before tests:** Ensure `pnpm` matches `packageManager` (`pnpm -v` → `9.0.0`), then rerun `pnpm install --frozen-lockfile` locally to mimic CI.
- **Playwright cannot find browsers:** Set `PLAYWRIGHT_BROWSERS_PATH=0 pnpm exec playwright install --with-deps` (mirrors `.github/workflows/ci.yml`).
- **Vercel preview missing env vars:** Run `vercel pull` to sync project + secret references defined in [`vercel.json`](vercel.json).
- **Netlify deploy uses stale cache:** `netlify deploy --build --clear-cache` respects `[build.environment]` from [`netlify.toml`](netlify.toml).
- **Need full gate status:** Check the [verification checklist](docs/adr/verification_checklist.md) for owners, cadence, and sign-off requirements before retrying CI.

### Common Issues

**Port 3000 already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
pnpm run dev -- --port 3001
```

**pnpm install fails:**
```bash
# Clear cache and retry
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**TypeScript errors after pulling latest:**
```bash
# Restart TypeScript server in your editor
# VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
# Or rebuild
pnpm run build
```

**Tailwind classes not applying:**
- Check `tailwind.config.ts` includes your file paths in `content: []`
- Ensure your editor has Tailwind CSS IntelliSense extension installed
- Verify you've imported `./src/index.css` in `main.tsx`

**Docker build fails:**
```bash
# Ensure Docker is running and you have enough disk space
docker system prune -a
docker build -t codemachine-landing .
```

### Clipboard Issues

The hero command panel relies on the async Clipboard API but carries a built-in fallback that selects the install command and announces instructions via an `aria-live="polite"` status message.

**Copy button not working:**
- **Secure context:** Clipboard writes require HTTPS (or `http://localhost`). Make sure you are not previewing the site over plain HTTP on a remote host.
- **Permissions:** Safari/Firefox may show a permission dialog the first time you press the copy button. Accept the prompt; if you previously denied it, open the browser’s page info (🔒 icon) and reset clipboard permissions.
- **Enterprise policies:** Some managed browsers disable clipboard access entirely. In those situations the fallback path below is triggered automatically.

**Fallback experience:**
- Whenever the Clipboard API throws, `useClipboardCommand` marks the status as `error`, selects the `<code>` element, and surfaces the helper text “Command highlighted — press Ctrl+C” so keyboard-only flows work reliably.
- Analytics events `hero_copy_success` / `hero_copy_fallback` appear in the console (or analytics endpoint) to help QA confirm the flow you hit.

**Testing clipboard functionality:**
```bash
# Development (localhost is secure context)
pnpm run dev

# Production preview (use HTTPS or localhost)
pnpm run build && pnpm run preview
```

**Manual copy workaround:**
If the copy button fails, click anywhere inside the command block (it uses `select-all`) and press `Ctrl+C` (Windows/Linux) or `Cmd+C` (macOS). The helper text only appears when the hook encounters an error, so seeing it confirms the fallback kicked in.

**Feature flag control:**
Clipboard interactions can be toggled in `src/content/flags.ts`:
```typescript
{
  key: 'clipboardInteractions',
  description: 'Allow HeroCommandPanel copy-to-clipboard action.',
  enabled: false, // Disable clipboard button entirely
}
```

### GitHub Star Badge Issues

The `IntegrationStatusBar` fetches live star counts, caches them for six hours, and now doubles as a link to the GitHub repo so visitors can verify telemetry themselves.

**Star count showing fallback value:**
- **Rate limits or timeouts:** GitHub caps unauthenticated calls at 60/hour. When the API returns 403 or times out, the badge falls back to `buildFallbackStarCopy()` (`"100+ Stars"`) and surfaces a `github_stars_fallback` analytics event.
- **Offline / network issues:** Cached data is used automatically. If no cache exists, the fallback copy renders along with a console warning.
- **Feature disabled:** When the `enableGithubStars` flag is `false`, the component intentionally renders the fallback and skips any network work.

**Badge click blocked:**
- The badge is an anchor pointing to `https://github.com/<owner>/<repo>`. Pop-up blockers that prevent background tabs can stop it from opening — allow the site to open new tabs for GitHub.com.
- Keyboard users can tab to the badge; it carries the Aura focus ring and activates with Enter/Space just like any other link.

**Checking rate limit status:**
```bash
# Check your current rate limit (requires curl)
curl -I https://api.github.com/rate_limit

# With authentication (higher limits)
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/rate_limit
```

**Increasing rate limits:**
1. Generate a GitHub Personal Access Token (PAT) at https://github.com/settings/tokens
2. Add to `.env.local` or your shell:
   ```bash
   VITE_GITHUB_TOKEN=ghp_yourTokenHere
   ```
3. Restart the dev server so Vite reloads the env var.

**Cache behavior:**
- **Duration:** 6 hours by default, overridable via `VITE_GITHUB_STARS_TTL_HOURS`.
- **Key:** `codemachine:metric:github-stars:{owner}/{repo}` (e.g., `codemachine:metric:github-stars:moazbuilds/CodeMachine-CLI`).
- **Manual clear:** In DevTools, run `localStorage.removeItem('codemachine:metric:github-stars:moazbuilds/CodeMachine-CLI')` to force a fresh fetch.

**Retry policy & analytics:**
- Fetches run inside `requestIdleCallback`, retry up to two times (with linear backoff), then log warnings and trigger the fallback display/analytics event.
- Successful cache hits / network fetches raise `github_stars_fetch` events with metadata describing whether the data came from cache or network.


### Getting Help

- Check existing [GitHub Issues](https://github.com/moazbuilds/CodeMachine-Website/issues)
- Review architectural docs in `docs/diagrams/` for component relationships
- Consult the [Aura Design System](#-aura-design-system) section for theming questions

## 📝 Development Roadmap

### ✅ Iteration I1 (Foundation) - COMPLETE
- I1.T1: React + Tailwind workspace with Aura theming
- I1.T2: Typed content models and ERD diagram
- I1.T3: ExperienceShell architecture with contexts
- I1.T4: README and component diagram (this document)

### ✅ Iteration I2 (Hero & Integrations) - COMPLETE
- I2.T1: Implement HeroCommandPanel with copy-to-clipboard
- I2.T2: VisualSimulationWindow desktop/mobile variants with reduced-motion support
- I2.T3: GitHub API integration for star count with retries + caching
- I2.T4: ScrollReveal provider + accessibility/analytics polish

### ✅ Iteration I3 (Feature grid & docs) - COMPLETE
- Build FeatureBentoGrid + supporting content blocks
- Author journey/verification docs for remaining flows
- Prep deployment + telemetry experiments

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This workspace is scaffolded for autonomous agent collaboration. Future tasks will extend components, hooks, and content following the established Aura design patterns.

---

**Build Status:** ✅ Ready
**Framework:** React 18
**Bundler:** Vite 5
**Theme:** Aura Design System