# CodeMachine Landing Page

> Autonomous AI agents for your codebase - Experience the future of development with intelligent, context-aware automation.

## 🎯 Project Overview

This is the landing page for CodeMachine, built with modern web technologies and featuring the **Aura design system** - a sophisticated dark theme with glassmorphic UI elements, ambient glows, and subtle noise textures.

### Technology Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3.4 with custom Aura theme
- **Icons:** Lucide React (tree-shakeable)
- **Package Manager:** pnpm 9.0.0
- **Deployment:** Docker-ready with multi-stage builds

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 9.0.0 or higher

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Open browser at http://localhost:3000
```

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
```

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

## 📝 Next Steps (Future Tasks)

1. **I1.T2:** Create typed content models and ERD diagram
2. **I1.T3:** Build component architecture and Mermaid diagram
3. **I2.T1:** Implement ExperienceShell and NavigationBar
4. **I2.T2:** Build HeroCommandPanel with clipboard interaction
5. **I2.T3:** Integrate GitHub API for star count

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

This workspace is scaffolded for autonomous agent collaboration. Future tasks will extend components, hooks, and content following the established Aura design patterns.

---

**Build Status:** ✅ Ready
**Framework:** React 18
**Bundler:** Vite 5
**Theme:** Aura Design System

Built with [Claude Code](https://claude.com/claude-code) 🤖
