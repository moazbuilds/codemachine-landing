## 1.0 Project Overview

**1.1 Project Name:** CodeMachine Landing Page (`codemachine.co`)
**1.2 Project Goal:** To create a high-converting, aesthetically premium landing page that explains the CodeMachine CLI orchestration engine, drives traffic to the documentation, and encourages users to install the tool via npm.
**1.3 Target Audience:** Senior Developers, DevOps Engineers, and AI Engineers looking for autonomous, agent-based workflow automation and production-ready code generation.

## 2.0 Core Functionality & User Journeys

### 2.1 Core Features List

The application is a static landing page that **MUST** adhere to the "Modern Dark-Mode SaaS" (Linear/Aura) aesthetic defined in **Section 5.0**.

  * **Hero Section & Quick Start:** MUST display the value proposition and a prominent, interactive code snippet for the installation command (`npm install -g codemachine`).
  * **GitHub Integration:** SHOULD display the current GitHub Star count for `moazbuilds/CodeMachine-CLI` to establish social proof.
  * **Feature Bento Grid:** MUST use a bento-grid layout to display core value props (Customizable Workflows, Multi-Agent Collaboration, Parallel Execution).
  * **Visual Simulation:** SHOULD include a "Glassmorphism" window simulation showing a terminal or workflow in action to visualize the "CLI-native" aspect.
  * **Docs Navigation:** MUST provide clear navigation to `http://docs.codemachine.co/`.
  * **Design Compliance:** The UI MUST utilize Tailwind CSS with the specific configuration defined in Section 5.0 (Aura Theme), featuring `bg-neutral-950` base, `text-indigo-400` accents, noise textures, and `backdrop-blur-xl` effects.

### 2.2 User Journeys

**Journey 1: First-Time Installation**

1.  User lands on `codemachine.co` → App MUST load the Hero section with a slow fade-in animation.
2.  User sees `npm install -g codemachine` command → User clicks "Copy" icon.
3.  App MUST copy text to clipboard → App SHOULD change icon to a "Checkmark" momentarily to confirm success.
4.  User executes command in their local terminal → Outcome: User installs the CLI.

**Journey 2: Feature Exploration**

1.  User scrolls down → App MUST reveal the "Bento Grid" feature section using a scroll-triggered fade-in.
2.  User hovers over a feature card (e.g., "Multi-Agent Collaboration") → App MUST apply a subtle inner glow (`ring-white/10`) and lighten the background (`hover:bg-white/5`) as per the glassmorphism spec.
3.  Outcome: User understands the technical capabilities of the orchestration engine.

**Journey 3: Documentation & Source Code**

1.  User clicks the "Docs" button in the nav or footer → App MUST open `http://docs.codemachine.co/` in a new tab.
2.  User clicks the "GitHub" icon/Star Badge → App MUST open `https://github.com/moazbuilds/CodeMachine-CLI` in a new tab.

## 3.0 Data Models

*Although this is a frontend presentation layer, the content structure matches the following models.*

**Entity: HeroContent**

  * `headline`: (REQUIRED, string) "Orchestrate Autonomy. CLI-Native."
  * `subheadline`: (REQUIRED, string) "Transform specification files into production-ready code through coordinated multi-agent workflows."
  * `install_command`: (REQUIRED, string, constant) `npm install -g codemachine`
  * `start_command`: (REQUIRED, string, constant) `codemachine`

**Entity: FeatureCard**

  * `title`: (REQUIRED, string) e.g., "Massively Parallel Execution"
  * `description`: (REQUIRED, string) Short summary of the capability.
  * `icon`: (REQUIRED, LucideIcon Name) e.g., `Workflow`, `Cpu`, `Zap`.
  * `grid_span`: (OPTIONAL, string) CSS class for bento grid sizing (e.g., `col-span-2`).

**Entity: ExternalLink**

  * `label`: (REQUIRED, string) e.g., "GitHub", "Docs".
  * `url`: (REQUIRED, valid URL)
  * `icon`: (REQUIRED, LucideIcon Name)

## 4.0 Essential Error Handling

**Mobile Responsiveness**

  * **Scenario:** User accesses site on a mobile device (\< 768px).
  * **Behavior:** The App MUST stack the "Bento Grid" columns vertically. The "Mac OS Window" simulation SHOULD be hidden or simplified to prevent horizontal scrolling.

**Clipboard Failure**

  * **Scenario:** User clicks the "Copy Command" button, but browser permissions deny clipboard access.
  * **Behavior:** The App SHOULD select the text manually to allow the user to copy via keyboard shortcuts (Ctrl+C).

**Missing External Resources**

  * **Scenario:** GitHub API (for star count) is unreachable.
  * **Behavior:** The App SHOULD fallback to a static "GitHub" label or a hardcoded number (e.g., "100+ Stars") rather than showing an empty loader or error code.

## 5.0 Design System & Visual Implementation (New)

The implementation **MUST** strictly adhere to the "Aura" visual style guide referenced below.

### 5.1 visual Assets & Textures

1.  **Background Noise:** A fixed-position SVG noise texture (`opacity: 0.03`) must be overlaid on the entire page to create a "film grain" effect.
2.  **Ambient Glows:** Large, blurred blobs (`blur-[120px]`) of `primary-600/10` and `blue-600/5` must be positioned in the background to provide depth.
3.  **Subtle Grid:** A background grid pattern (`linear-gradient`) with extremely low opacity (`0.07`) to reinforce the "engineering/blueprint" aesthetic.

### 5.2 Typography

  * **Headings:** `Inter` (sans-serif) with tight tracking (`tracking-tighter`).
  * **Code/Technical:** `JetBrains Mono` (monospace) for all terminal outputs, code snippets, and version numbers.

### 5.3 Component Styles (Glassmorphism)

All cards and windows must use the following class structure:

```css
.glass-card {
    background: rgba(10, 10, 10, 0.6);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}
```

### 5.4 Reference Implementation (HTML)

The developer **MUST** use the following HTML structure and Tailwind classes as the "Golden Master" for visual fidelity.

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeMachine | Aura Style</title>
    <meta name="description" content="CLI-native orchestration engine for autonomous workflows.">
    
    <!-- Fonts: Inter (Tight tracking) & JetBrains Mono -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Tailwind Config -->
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        // Aura-style typically uses true neutrals or zinc
                        neutral: {
                            850: '#171717',
                            900: '#0a0a0a',
                            925: '#050505',
                            950: '#000000', // Pure black base
                        },
                        // Electric Indigo/Violet accents
                        primary: {
                            400: '#a78bfa',
                            500: '#8b5cf6',
                            600: '#7c3aed',
                        }
                    },
                    backgroundImage: {
                        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #2a2a2a 0deg, #000000 180deg, #2a2a2a 360deg)',
                        'subtle-grid': 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
                    },
                    animation: {
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'shimmer': 'shimmer 2s linear infinite',
                    },
                    keyframes: {
                        shimmer: {
                            from: { backgroundPosition: '0 0' },
                            to: { backgroundPosition: '-200% 0' },
                        }
                    }
                }
            }
        }
    </script>

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>

    <style>
        /* Aura Style Noise Texture */
        .bg-noise {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.03;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }

        /* Custom Scrollbar - Minimalist */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #444; }
        
        .glass-card {
            background: rgba(10, 10, 10, 0.6);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .text-glow {
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        }
    </style>
</head>
<body class="bg-neutral-950 text-neutral-400 antialiased selection:bg-primary-500/30 selection:text-primary-400 overflow-x-hidden relative min-h-screen flex flex-col font-sans">

    <!-- Noise Texture Overlay -->
    <div class="bg-noise"></div>

    <!-- Subtle Grid Background -->
    <div class="fixed inset-0 z-0 pointer-events-none opacity-[0.07]" style="background-size: 40px 40px; background-image: linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px);"></div>

    <!-- Ambient Glows -->
    <div class="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
    <div class="fixed bottom-[-10%] right-[-10%] w-[800px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>

    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-neutral-950/70 backdrop-blur-xl transition-all duration-300">
        <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="relative w-6 h-6 flex items-center justify-center">
                    <div class="absolute inset-0 bg-primary-500 blur-md opacity-40"></div>
                    <i data-lucide="cpu" class="w-5 h-5 text-white relative z-10"></i>
                </div>
                <span class="text-white font-medium tracking-tight text-sm">CodeMachine</span>
            </div>

            <div class="hidden md:flex items-center gap-8">
                <a href="#features" class="text-xs font-medium text-neutral-400 hover:text-white transition-colors">Features</a>
                <a href="http://docs.codemachine.co/" target="_blank" class="text-xs font-medium text-neutral-400 hover:text-white transition-colors">Docs</a>
                <div class="h-3 w-px bg-white/10"></div>
                <a href="https://github.com/moazbuilds/CodeMachine-CLI" target="_blank" class="flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors group">
                    <i data-lucide="github" class="w-3.5 h-3.5"></i>
                    <span>Star</span>
                </a>
            </div>
            
            <div class="md:hidden">
                <i data-lucide="menu" class="w-5 h-5 text-white"></i>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <main class="flex-grow relative z-10 pt-32 pb-20 px-6">
        <div class="max-w-4xl mx-auto text-center mb-20">
            
            <!-- Pill Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[11px] font-medium mb-8 hover:bg-white/10 transition-colors cursor-default backdrop-blur-sm">
                <span class="flex h-1.5 w-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
                v1.0 Public Beta
            </div>

            <!-- Headlines -->
            <h1 class="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-6 leading-[1.1]">
                Orchestrate Autonomy. <br>
                <span class="bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">CLI-Native.</span>
            </h1>
            <p class="text-lg md:text-xl text-neutral-500 max-w-xl mx-auto mb-10 leading-relaxed font-light">
                Transform specification files into production-ready code through coordinated multi-agent workflows.
            </p>

            <!-- CLI Input & CTA -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
                <!-- Install Command Input-Style -->
                <div class="relative group w-full">
                    <div class="absolute -inset-0.5 bg-gradient-to-r from-primary-500/30 to-blue-500/30 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div class="relative flex items-center justify-between px-4 py-3 bg-neutral-900 border border-white/10 rounded-lg shadow-xl">
                        <div class="flex items-center gap-3 overflow-hidden">
                            <span class="text-neutral-600 font-mono text-sm select-none">$</span>
                            <code id="install-cmd" class="font-mono text-sm text-neutral-200 bg-transparent border-none focus:ring-0 p-0 truncate">npm install -g codemachine</code>
                        </div>
                        <button onclick="copyCommand()" class="ml-3 pl-3 border-l border-white/5 text-neutral-500 hover:text-white transition-colors" aria-label="Copy">
                            <i id="copy-icon" data-lucide="copy" class="w-4 h-4"></i>
                        </button>
                    </div>
                    <div id="copy-toast" class="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[10px] text-primary-400 opacity-0 transition-opacity pointer-events-none font-medium">Copied to clipboard</div>
                </div>

                <!-- Primary Button -->
                <a href="http://docs.codemachine.co/" target="_blank" class="w-full sm:w-auto px-6 py-3 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 whitespace-nowrap">
                    Documentation
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </a>
            </div>
        </div>

        <!-- Visual Simulation: High Fidelity App Window -->
        <div class="max-w-5xl mx-auto perspective-1000 relative group">
            <!-- Glow behind window -->
            <div class="absolute -inset-1 bg-gradient-to-b from-primary-500/20 to-transparent rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div class="glass-card rounded-xl overflow-hidden shadow-2xl relative bg-[#09090b]">
                <!-- Window Header -->
                <div class="h-9 bg-[#18181b] border-b border-white/5 flex items-center px-4 justify-between select-none">
                    <div class="flex gap-1.5">
                        <div class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-red-500/50 transition-colors"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-yellow-500/50 transition-colors"></div>
                        <div class="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-green-500/50 transition-colors"></div>
                    </div>
                    <div class="text-[10px] text-neutral-500 font-mono flex items-center gap-2">
                        <i data-lucide="command" class="w-3 h-3"></i>
                        cm-dashboard — v1.0.4
                    </div>
                    <div class="w-10"></div>
                </div>
                
                <!-- TUI Dashboard Content -->
                <div class="font-mono text-[12px] md:text-[13px] text-neutral-400 h-[400px] flex flex-col bg-[#09090b]">
                    
                    <!-- Main Split View -->
                    <div class="flex-1 flex overflow-hidden">
                        
                        <!-- Left Panel: Agent Hierarchy (Tree View) -->
                        <div class="w-1/3 border-r border-white/10 flex flex-col bg-black/20">
                            <div class="px-4 py-3 border-b border-white/5 text-[10px] uppercase tracking-wider text-neutral-500 font-bold flex items-center justify-between">
                                <span>Active Swarm</span>
                                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            </div>
                            <div class="p-3 space-y-4 overflow-y-auto">
                                <!-- Planner Agent (Completed) -->
                                <div class="opacity-60">
                                    <div class="flex items-center gap-2 text-emerald-400 mb-1">
                                        <i data-lucide="check" class="w-3 h-3"></i>
                                        <span class="font-bold">Planner (Claude Code)</span>
                                    </div>
                                    <div class="pl-5 border-l border-white/10 ml-1.5 space-y-1">
                                        <div class="text-neutral-500">analyze_spec.md</div>
                                        <div class="text-neutral-500">gen_architecture</div>
                                    </div>
                                </div>

                                <!-- Coder Agent (Active) -->
                                <div>
                                    <div class="flex items-center gap-2 text-primary-400 mb-1">
                                        <div class="w-3 h-3 flex items-center justify-center">
                                            <div class="w-1.5 h-1.5 bg-primary-400 rounded-full animate-ping absolute"></div>
                                            <div class="w-1.5 h-1.5 bg-primary-400 rounded-full relative"></div>
                                        </div>
                                        <span class="font-bold text-white">Coder (Codex)</span>
                                    </div>
                                    <div class="pl-5 border-l border-primary-500/30 ml-1.5 space-y-2">
                                        <div class="text-primary-300"> writing: /src/App.tsx</div>
                                        <div class="text-neutral-500"> pending: /src/comps/*</div>
                                    </div>
                                </div>

                                <!-- Reviewer Agent (Pending) -->
                                <div class="opacity-40">
                                    <div class="flex items-center gap-2 text-neutral-500 mb-1">
                                        <i data-lucide="circle" class="w-3 h-3"></i>
                                        <span class="font-bold">Reviewer (Llama)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Panel: Live Output / Code -->
                        <div class="w-2/3 flex flex-col bg-[#0c0c0e] relative">
                            <!-- Tabs -->
                            <div class="flex border-b border-white/5">
                                <div class="px-4 py-2 bg-white/5 text-neutral-200 border-r border-white/5 border-t-2 border-t-primary-500 text-xs">
                                    Output Stream
                                </div>
                                <div class="px-4 py-2 text-neutral-600 border-r border-white/5 hover:bg-white/[0.02] transition-colors text-xs">
                                    Terminal
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="p-4 font-mono text-xs space-y-2 overflow-hidden relative flex-1">
                                <div class="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0c0c0e] z-10"></div>
                                
                                <!-- CodeMachine ASCII Logo Banner -->
                                <div class="mb-6 select-none leading-none font-bold opacity-50 text-[10px] sm:text-[11px] text-neutral-500 whitespace-pre font-mono tracking-tighter">
█▀▀ █▀█ █▀▄ █▀▀ █▀▄▀█ ▄▀█ █▀▀ █ █ █ █▄ █ █▀▀
█▄▄ █▄█ █▄▀ ██▄ █ ▀ █ █▀█ █▄▄ █▀█ █ █ ▀█ ██▄

<span class="text-neutral-600 font-normal tracking-normal block mt-2">v1.0.4 // ORCHESTRATION_ENGINE // READY</span>
                                </div>

                                <div class="text-neutral-500 flex gap-2">
                                    <span>[10:42:01]</span>
                                    <span class="text-blue-400">INFO</span>
                                    <span>Initializing React scaffolding...</span>
                                </div>
                                <div class="text-neutral-500 flex gap-2">
                                    <span>[10:42:03]</span>
                                    <span class="text-purple-400">AGENT</span>
                                    <span>Generating component structure based on spec...</span>
                                </div>
                                
                                <!-- Simulated Code Block -->
                                <div class="mt-4 p-3 bg-[#050505] rounded border border-white/5 text-neutral-300">
                                    <div class="flex gap-2 mb-2 border-b border-white/5 pb-2">
                                        <span class="text-yellow-500">write_file</span>
                                        <span class="text-neutral-500">./src/components/Dashboard.tsx</span>
                                    </div>
                                    <div class="opacity-80">
                                        <span class="text-pink-400">export default function</span> <span class="text-yellow-300">Dashboard</span>() {<br>
                                        &nbsp;&nbsp;<span class="text-pink-400">return</span> (<br>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="text-blue-300">div</span> <span class="text-green-400">className</span>=<span class="text-orange-300">"min-h-screen bg-zinc-950"</span>&gt;<br>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="text-yellow-300">Sidebar</span> /&gt;<br>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="text-yellow-300">MainContent</span> /&gt;<br>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span class="text-blue-300">div</span>&gt;<br>
                                        &nbsp;&nbsp;);<br>
                                        }<span class="animate-pulse inline-block w-2 h-4 bg-primary-400 align-middle ml-1"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Moved Bottom Status Bar (Telemetry) -->
                    <div class="border-t border-white/10 bg-black/40">
                        <!-- Row 1: Telemetry & Session -->
                        <div class="flex items-center justify-between px-4 py-1.5 border-b border-white/5">
                             <div class="flex gap-4 text-[10px]">
                                <span class="text-neutral-500">SESSION ID:</span>
                                <span class="text-primary-400">#8f3a-29b1</span>
                            </div>
                            <div class="flex gap-4 text-[10px]">
                                <div class="flex items-center gap-2">
                                    <span class="text-emerald-500">ORCHESTRATOR ACTIVE</span>
                                </div>
                                <span class="text-neutral-600">|</span>
                                <span class="text-neutral-400">TOKENS: 4,231</span>
                            </div>
                        </div>
                        
                        <!-- Row 2: System Resources -->
                        <div class="h-8 flex items-center px-4 justify-between text-[10px] text-neutral-600 bg-[#09090b]">
                            <div class="flex gap-4">
                                <span>CPU: 12%</span>
                                <span>MEM: 420MB</span>
                                <span>Threads: 4/12</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-1.5 h-1.5 rounded-full bg-neutral-600"></div>
                                <span>Awaiting Review</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </main>

    <!-- Feature Section (Bento Grid) -->
    <section id="features" class="relative z-10 py-24 border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                <div>
                    <h2 class="text-2xl md:text-3xl font-semibold text-white mb-2 tracking-tight">Engineered for Velocity</h2>
                    <p class="text-neutral-500 text-sm max-w-md">A complete engine for software generation, built to handle complexity without breaking.</p>
                </div>
                <a href="http://docs.codemachine.co/" class="text-xs font-medium text-white border-b border-white/20 hover:border-white pb-0.5 transition-all self-start md:self-auto">
                    View full specifications
                </a>
            </div>

            <!-- Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <!-- Card 1 -->
                <div class="md:col-span-2 glass-card rounded-xl p-8 hover:bg-white/5 transition-all duration-500 group relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100"></div>
                    
                    <div class="relative z-10 flex flex-col h-full justify-between">
                        <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                            <i data-lucide="git-merge" class="text-white w-5 h-5"></i>
                        </div>
                        <div>
                            <h3 class="text-lg font-medium text-white mb-2">End-to-End Workflows</h3>
                            <p class="text-sm text-neutral-500 leading-relaxed max-w-lg">
                                Architect sophisticated pipelines from simple scripts to multi-day development cycles. CodeMachine maintains context across the entire lifecycle, ensuring no hallucinated imports or broken dependencies.
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Card 2 -->
                <div class="md:col-span-1 glass-card rounded-xl p-8 hover:bg-white/5 transition-all duration-500 group">
                    <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                        <i data-lucide="users" class="text-white w-5 h-5"></i>
                    </div>
                    <h3 class="text-lg font-medium text-white mb-2">Multi-Agent Swarm</h3>
                    <p class="text-sm text-neutral-500 leading-relaxed">
                        Assign Gemini for planning and Claude for implementation. Specialized agents work in harmony to reduce error rates.
                    </p>
                </div>

                <!-- Card 3 -->
                <div class="md:col-span-1 glass-card rounded-xl p-8 hover:bg-white/5 transition-all duration-500 group">
                    <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                        <i data-lucide="zap" class="text-white w-5 h-5"></i>
                    </div>
                    <h3 class="text-lg font-medium text-white mb-2">Parallel Execution</h3>
                    <p class="text-sm text-neutral-500 leading-relaxed">
                        Simultaneous sub-agent deployment drastically reduces build time. Why run serial when you can run parallel?
                    </p>
                </div>

                <!-- Card 4 -->
                <div class="md:col-span-2 glass-card rounded-xl p-8 hover:bg-white/5 transition-all duration-500 group relative overflow-hidden">
                     <!-- Graphic Element -->
                     <div class="absolute right-0 bottom-0 h-full w-1/2 opacity-20 pointer-events-none overflow-hidden">
                         <div class="absolute bottom-0 right-0 w-full h-40 bg-gradient-to-t from-primary-500/20 to-transparent"></div>
                         <!-- Fake lines of code visual -->
                         <div class="space-y-2 p-8 text-[10px] font-mono text-right text-primary-300 opacity-50">
                             <div>import { Orchestrator } from '@cm/core';</div>
                             <div>const workflow = new Orchestrator();</div>
                             <div>await workflow.dispatch('build');</div>
                         </div>
                     </div>

                    <div class="relative z-10">
                        <div class="w-10 h-10 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                            <i data-lucide="infinity" class="text-white w-5 h-5"></i>
                        </div>
                        <h3 class="text-lg font-medium text-white mb-2">Persistent Orchestration</h3>
                        <p class="text-sm text-neutral-500 leading-relaxed max-w-md">
                            Execute workflows for hours or days. The engine handles interruptions, state management, and iterative refinement autonomously without user intervention.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-neutral-950 border-t border-white/5 py-12 mt-auto relative z-10">
        <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                <i data-lucide="cpu" class="w-4 h-4 text-white"></i>
                <span class="text-white text-xs font-medium tracking-wide">CODEMACHINE</span>
            </div>
            <div class="flex gap-8">
                <a href="https://github.com/moazbuilds/CodeMachine-CLI" target="_blank" class="text-xs text-neutral-500 hover:text-white transition-colors">GitHub</a>
                <a href="http://docs.codemachine.co/" target="_blank" class="text-xs text-neutral-500 hover:text-white transition-colors">Documentation</a>
                <a href="#" class="text-xs text-neutral-500 hover:text-white transition-colors">Twitter</a>
            </div>
        </div>
    </footer>

    <script>
        lucide.createIcons();

        function copyCommand() {
            const commandText = document.getElementById('install-cmd').innerText;
            const toast = document.getElementById('copy-toast');

            navigator.clipboard.writeText(commandText).then(() => {
                toast.classList.remove('opacity-0');
                toast.classList.add('opacity-100');
                setTimeout(() => {
                    toast.classList.remove('opacity-100');
                    toast.classList.add('opacity-0');
                }, 2000);
            });
        }
    </script>
</body>
</html>