/**
 * MobileCard Component
 * Referenced by: src/App.tsx
 *
 * Simplified mobile fallback for VisualSimulationWindow.
 * Displays stacked panes without heavy 3D transforms or complex animations.
 *
 * Features:
 * - Vertical stacking layout optimized for mobile
 * - Glass-card styling maintained
 * - Simplified animations (fade-in only)
 * - Shares prop interface with parent component
 */

import { useRef, useEffect } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useScrollRevealContext } from '@/context/ScrollRevealProvider'
import { Terminal, Activity, Cpu } from 'lucide-react'
import type { SimulationPane, SimulationMetric } from './index'
import { trackEvent } from '@/lib/analytics'

export interface MobileCardProps {
  panes?: SimulationPane[]
  metrics?: SimulationMetric[]
  className?: string
}

const defaultPanes: SimulationPane[] = [
  {
    id: 'install',
    label: 'Installation',
    icon: 'terminal',
    accent: 'primary',
    content: [
      '$ npx @anthropic-ai/create-codemachine',
      'Creating new project...',
      '✓ Scaffolded successfully',
      '✓ Dependencies installed',
    ],
  },
  {
    id: 'telemetry',
    label: 'Telemetry',
    icon: 'activity',
    accent: 'emerald',
    content: [
      '[Analytics] Page loaded',
      '[Analytics] Copy: Success ✓',
      '[Telemetry] Build: Passing',
    ],
  },
]

const defaultMetrics: SimulationMetric[] = [
  {
    label: 'Build Time',
    value: '847ms',
    description: 'Avg completion',
  },
  {
    label: 'Bundle',
    value: '142KB',
    description: 'Gzipped',
  },
]

const iconMap = {
  terminal: Terminal,
  activity: Activity,
  cpu: Cpu,
}

const accentColorMap = {
  primary: 'text-primary-400 border-primary-500/30',
  emerald: 'text-emerald-400 border-emerald-500/30',
  blue: 'text-blue-400 border-blue-500/30',
}

export function MobileCard({
  panes = defaultPanes,
  metrics = defaultMetrics,
  className = '',
}: MobileCardProps) {
  const containerRef = useRef<HTMLElement>(null)
  const isVisible = useScrollReveal(containerRef)
  const { reducedMotion } = useScrollRevealContext()
  const revealActive = reducedMotion || isVisible

  useEffect(() => {
    if (isVisible) {
      trackEvent('simulation_play', { surface: 'mobile' })
    }
  }, [isVisible])

  return (
    <section
      ref={containerRef}
      id="simulation-mobile"
      aria-label="Simulation preview"
      className={`md:hidden mx-auto max-w-xl py-12 px-4 content-visibility-auto ${className}`}
    >
      {/* Section Header */}
      <div className="mb-6 text-center">
        <p className="label-telemetry text-neutral-500 mb-2">Live Preview</p>
        <h2 className="text-2xl font-light tracking-tight text-gradient-primary mb-3">
          See It in Action
        </h2>
        <p className="text-sm text-neutral-400">
          Installation flow and live metrics from your command panel interaction.
        </p>
      </div>

      {/* Simplified Glass Container */}
      <div
        className={`glass-surface rounded-xl p-4 border-white/10 shadow-xl transition-all duration-500 motion-reduce:transition-none ${
          revealActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Panes Stacked Vertically */}
        <div className="space-y-3 mb-4">
          {panes.map((pane) => {
            const Icon = iconMap[pane.icon]
            const accentClass = accentColorMap[pane.accent]

            return (
              <div
                key={pane.id}
                className={`glass-surface rounded-lg p-3 border ${accentClass}`}
              >
                {/* Pane Header */}
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono uppercase tracking-wider">
                    {pane.label}
                  </span>
                </div>

                {/* Pane Content - Truncated for mobile */}
                <div className="font-mono text-[10px] leading-relaxed space-y-0.5">
                  {pane.content.slice(0, 4).map((line: string, lineIndex: number) => (
                    <div
                      key={lineIndex}
                      className={
                        line.startsWith('✓') || line.includes('Success')
                          ? 'text-emerald-400'
                          : line.startsWith('$')
                            ? 'text-primary-300'
                            : line.startsWith('[')
                              ? 'text-blue-300'
                              : 'text-neutral-400'
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Metrics - Horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 pt-3 border-t border-white/5 scrollbar-hide">
          {metrics.map((metric) => (
            <div key={metric.label} className="flex-shrink-0 min-w-[120px]">
              <p className="label-telemetry text-neutral-500 text-[10px] mb-1">
                {metric.label}
              </p>
              <p className="text-xl font-light text-gradient-primary mb-0.5">
                {metric.value}
              </p>
              <p className="text-[10px] text-neutral-500">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle glow for mobile */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] bg-primary-500/5 rounded-full blur-[80px] pointer-events-none -z-10"
        style={{
          opacity: reducedMotion ? 0.2 : revealActive ? 0.3 : 0,
          transition: reducedMotion ? 'none' : 'opacity 1s ease-out',
        }}
      />
    </section>
  )
}
