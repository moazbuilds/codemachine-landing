/**
 * VisualSimulationWindow Component - Aura Terminal Style
 * High-fidelity terminal simulation matching the Aura design system
 *
 * Features:
 * - Split-pane TUI dashboard (Agent Hierarchy + Output Stream)
 * - ASCII art CodeMachine logo
 * - Syntax-highlighted code blocks
 * - Session telemetry and system resources
 * - Glass-card styling with window chrome
 */

import { Command } from 'lucide-react'

// Types exported for MobileCard
export interface SimulationPane {
  id: string
  label: string
  icon: 'terminal' | 'activity' | 'cpu'
  accent: 'primary' | 'emerald' | 'blue'
  content: string[]
}

export interface SimulationMetric {
  label: string
  value: string
  description: string
}

export function VisualSimulationWindow() {
  return (
    <section className="max-w-5xl mx-auto px-6 mb-20 relative">
      {/* Marketing Header */}
      <div className="text-center mb-8 space-y-3">
        <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight font-sans">
          Watch AI Agents Work in Real-Time
        </h2>
        <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto font-sans">
          See how CodeMachine orchestrates multiple AI engines to transform your specifications into production-ready code—autonomously.
        </p>
      </div>

      {/* Glow behind window - Cyan branding */}
      <div className="absolute -inset-1 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000" />

      <div className="glass-card rounded-xl overflow-hidden shadow-2xl relative bg-[#09090b]">
        {/* Window Header */}
        <div className="h-9 bg-[#18181b] border-b border-white/5 flex items-center px-4 justify-between select-none">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-red-500/50 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-yellow-500/50 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10 hover:bg-green-500/50 transition-colors" />
          </div>
          <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-2">
            <Command className="w-3 h-3" />
            codemachine 0.7.0
          </div>
          <div className="w-10" />
        </div>

        {/* TUI Dashboard Content */}
        <div className="font-mono text-[12px] md:text-[13px] text-neutral-400 h-[300px] md:h-[400px] flex flex-col bg-[#09090b]">

          {/* Main Split View */}
          <div className="flex-1 flex overflow-hidden">

            {/* Left Panel: Agent Hierarchy (Tree View) - Hidden on mobile */}
            <div className="hidden md:flex w-1/3 border-r border-white/10 flex-col bg-black/20">
              <div className="px-4 py-3 border-b border-white/5 text-[11px] text-white font-semibold flex items-center justify-between">
                <span>Workflow Pipeline</span>
              </div>
              <div className="p-3 space-y-3 overflow-y-auto text-[11px]">
                {/* Init (Completed) */}
                <div className="flex items-start gap-2 opacity-60">
                  <span className="text-cyan-400">●</span>
                  <div className="flex-1">
                    <div className="text-white">
                      <span className="font-semibold">Init</span>{' '}
                      <span className="text-neutral-500">(codex)</span>
                      <span className="text-neutral-600 ml-2">• 00:01</span>
                    </div>
                  </div>
                </div>

                {/* Principal Analyst - Checkpoint (Active) */}
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400">●</span>
                  <div className="flex-1">
                    <div className="text-white">
                      <span className="font-semibold">Principal Analyst - Checkpoint</span>{' '}
                      <span className="text-neutral-500">(claude)</span>
                      <span className="text-neutral-600 ml-2">• 00:03</span>
                    </div>
                    <div className="text-neutral-500 text-[10px] mt-1 ml-4">
                      → Planning Phase →
                    </div>
                    <div className="ml-4 mt-2 space-y-1.5 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-600">○</span>
                        <span className="text-neutral-400">Blueprint Orchestrator</span>
                        <span className="text-neutral-600">(codex)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-600">○</span>
                        <span className="text-neutral-400">Plan Agent</span>
                        <span className="text-neutral-600">(codex)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-600">○</span>
                        <span className="text-neutral-400">Task Breakdown Agent</span>
                        <span className="text-neutral-600">(codex)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-600">○</span>
                        <span className="text-neutral-400">Git Commit Agent</span>
                        <span className="text-neutral-600">(cursor)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Context Manager Agent (Pending) */}
                <div className="flex items-start gap-2 opacity-40">
                  <span className="text-neutral-600">○</span>
                  <div className="flex-1">
                    <div className="text-neutral-500">
                      <span className="font-semibold">Context Manager Agent</span>{' '}
                      <span className="text-neutral-600">(codex)</span>
                    </div>
                  </div>
                </div>

                {/* Code Generation Agent (Pending) */}
                <div className="flex items-start gap-2 opacity-40">
                  <span className="text-neutral-600">○</span>
                  <div className="flex-1">
                    <div className="text-neutral-500">
                      <span className="font-semibold">Code Generation Agent</span>{' '}
                      <span className="text-neutral-600">(claude)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel: Live Output / Code - Full width on mobile */}
            <div className="w-full md:w-2/3 flex flex-col bg-[#0c0c0e] relative">
              {/* Single Tab - Output */}
              <div className="flex border-b border-white/5">
                <div className="px-4 py-3 text-white text-[11px] font-semibold">
                  Output: Frontend MainAgent
                </div>
              </div>

              {/* Content */}
              <div className="p-4 font-mono text-xs space-y-2 overflow-hidden relative flex-1">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0c0c0e] z-10" />

                {/* CodeMachine ASCII Logo Banner - Cyan branding */}
                <div className="mb-6 select-none font-bold opacity-50 text-[10px] sm:text-[11px] text-cyan-400">
                  <pre className="font-mono leading-tight m-0 p-0" style={{ fontFamily: 'monospace', letterSpacing: '0' }}>{`█▀▀ █▀█ █▀▄ █▀▀ █▀▄▀█ ▄▀█ █▀▀ █ █ █ █▄ █ █▀▀
█▄▄ █▄█ █▄▀ ██▄ █ ▀ █ █▀█ █▄▄ █▀█ █ █ ▀█ ██▄`}</pre>
                  <span className="text-neutral-600 font-normal tracking-normal block mt-2">
                    v1.0.4 // ORCHESTRATION_ENGINE // READY
                  </span>
                </div>

                <div className="text-neutral-500 flex gap-2">
                  <span>[10:42:01]</span>
                  <span className="text-cyan-400">INFO</span>
                  <span>Initializing React scaffolding...</span>
                </div>
                <div className="text-neutral-500 flex gap-2">
                  <span>[10:42:03]</span>
                  <span className="text-cyan-400">AGENT</span>
                  <span>Generating component structure based on spec...</span>
                </div>

                {/* Simulated Code Block - Cyan syntax highlighting */}
                <div className="mt-4 p-3 bg-[#050505] rounded border border-cyan-500/20 text-neutral-300">
                  <div className="flex gap-2 mb-2 border-b border-cyan-500/20 pb-2">
                    <span className="text-cyan-400">write_file</span>
                    <span className="text-neutral-500">./src/components/Dashboard.tsx</span>
                  </div>
                  <div className="opacity-80">
                    <span className="text-cyan-400">export default function</span>{' '}
                    <span className="text-cyan-300">Dashboard</span>
                    {'() {\n'}
                    {'  '}
                    <span className="text-cyan-400">return</span>
                    {' (\n'}
                    {'    <'}
                    <span className="text-cyan-200">div</span>{' '}
                    <span className="text-cyan-300">className</span>
                    {'='}
                    <span className="text-neutral-400">"min-h-screen bg-zinc-950"</span>
                    {'>\n'}
                    {'      <'}
                    <span className="text-cyan-300">Sidebar</span>
                    {' />\n'}
                    {'      <'}
                    <span className="text-cyan-300">MainContent</span>
                    {' />\n'}
                    {'    </'}
                    <span className="text-cyan-200">div</span>
                    {'>\n'}
                    {'  );\n'}
                    {'}'}
                    <span className="animate-pulse inline-block w-2 h-4 bg-cyan-400 align-middle ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status Bar (Telemetry) */}
          <div className="border-t border-white/10 bg-black/40">
            {/* Row 1: Telemetry & Session - Cyan branding */}
            <div className="flex items-center justify-between px-4 py-1.5 border-b border-white/5">
              <div className="flex gap-4 text-[10px]">
                <span className="text-neutral-500">SESSION ID:</span>
                <span className="text-cyan-400">#8f3a-29b1</span>
              </div>
              <div className="flex gap-4 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">ORCHESTRATOR ACTIVE</span>
                </div>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-400">TOKENS: 4,231</span>
              </div>
            </div>

            {/* Row 2: System Resources */}
            <div className="h-8 flex items-center px-4 justify-between text-[10px] text-neutral-600 bg-[#09090b]">
              <div className="flex gap-4">
                <span>CPU: 12%</span>
                <span>MEM: 420MB</span>
                <span>Threads: 4/12</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                <span>Awaiting Review</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
