/**
 * VisualSimulationWindow Component
 * Referenced by: src/App.tsx
 * Task: I3.T3 - Enhanced with mobile fallback and lazy loading
 *
 * Desktop variant of the simulation window showing terminal panes, telemetry,
 * and animation tokens with glassmorphic styling and scroll-based reveal effects.
 *
 * Features:
 * - Glass-card styling with perspective transforms
 * - Scroll-triggered fade/perspective animations
 * - Multi-pane terminal simulation UI
 * - Respects prefers-reduced-motion
 * - Props-driven for reusability
 * - Mobile fallback screenshot (<35KB WebP) with lazy loading
 * - Deferred animations via requestIdleCallback
 */

import { useRef, useEffect, useState, useCallback } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useScrollRevealContext } from '@/context/ScrollRevealProvider'
import { Terminal, Activity, Cpu } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

export interface SimulationPane {
  id: string
  label: string
  icon: 'terminal' | 'activity' | 'cpu'
  content: string[]
  accent: 'primary' | 'emerald' | 'blue'
}

export interface SimulationMetric {
  label: string
  value: string
  description: string
}

export interface VisualSimulationWindowProps {
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
      '$ npx @anthropic-ai/create-codemachine my-project',
      'Creating a new CodeMachine project in my-project...',
      '✓ Project scaffolded successfully',
      '✓ Dependencies installed',
      '✓ Git repository initialized',
      '',
      'Next steps:',
      '  cd my-project',
      '  npm run dev',
    ],
  },
  {
    id: 'telemetry',
    label: 'Live Telemetry',
    icon: 'activity',
    accent: 'emerald',
    content: [
      '[Analytics] Page loaded • Journey: Install',
      '[Analytics] Hero copy attempt • Command: npx...',
      '[Analytics] Clipboard write: Success ✓',
      '[Analytics] Simulation scroll reveal triggered',
      '[Telemetry] Build status: Passing',
      '[Telemetry] Theme: Aura Dark',
      '[Telemetry] Framework: React + Vite',
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: 'cpu',
    accent: 'blue',
    content: [
      'Build time: 847ms',
      'Bundle size: 142.3 KB (gzip)',
      'First paint: 0.6s',
      'Interactive: 1.2s',
      'Lighthouse score: 98/100',
      '',
      '⚡ Optimizations active:',
      '  • Tree-shaking enabled',
      '  • Code splitting configured',
    ],
  },
]

const defaultMetrics: SimulationMetric[] = [
  {
    label: 'Response Time',
    value: '847ms',
    description: 'Average build completion',
  },
  {
    label: 'Bundle Size',
    value: '142KB',
    description: 'Gzipped production build',
  },
  {
    label: 'Lighthouse',
    value: '98/100',
    description: 'Performance score',
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

const glowColorMap = {
  primary: 'shadow-primary-500/20',
  emerald: 'shadow-emerald-500/20',
  blue: 'shadow-blue-500/20',
}

export function VisualSimulationWindow({
  panes = defaultPanes,
  metrics = defaultMetrics,
  className = '',
}: VisualSimulationWindowProps) {
  const containerRef = useRef<HTMLElement>(null)
  const isVisible = useScrollReveal(containerRef)
  const { reducedMotion } = useScrollRevealContext()
  const revealActive = reducedMotion || isVisible
  const [imageLoaded, setImageLoaded] = useState(false)
  const [idleAnimationsReady, setIdleAnimationsReady] = useState(false)
  const handleImageLoad = useCallback(() => {
    setImageLoaded((prev) => {
      if (!prev) {
        trackEvent('simulation_play', { surface: 'mobile_fallback' })
      }
      return true
    })
  }, [])

  // Track analytics when visible
  useEffect(() => {
    if (isVisible) {
      trackEvent('simulation_play', { surface: 'desktop' })
    }
  }, [isVisible])

  // Defer heavy animations until main thread is idle
  useEffect(() => {
    if (!isVisible || reducedMotion) return

    // Use requestIdleCallback with setTimeout fallback for Safari
    if (typeof window !== 'undefined') {
      const deferAnimations = () => {
        setIdleAnimationsReady(true)
      }

      if ('requestIdleCallback' in window) {
        const idleCallbackId = window.requestIdleCallback(deferAnimations, {
          timeout: 2000,
        })
        return () => window.cancelIdleCallback(idleCallbackId)
      } else {
        const timeoutId = window.setTimeout(deferAnimations, 100)
        return () => window.clearTimeout(timeoutId)
      }
    }
  }, [isVisible, reducedMotion])

  return (
    <section
      ref={containerRef}
      id="simulation"
      aria-label="Live simulation window"
      className={`relative mx-auto max-w-6xl py-16 content-visibility-auto ${className}`}
    >
      {/* Section Header */}
      <div className="mb-8 text-center">
        <p className="label-telemetry text-neutral-500 mb-3">Live Preview</p>
        <h2 className="heading-section text-gradient-primary mb-4">
          See CodeMachine in Action
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto">
          Watch the installation flow, telemetry streams, and performance metrics
          in real-time as you interact with the hero command panel above.
        </p>
      </div>

      {/* Mobile Fallback Screenshot (hidden on desktop) */}
      <picture
        className={`md:hidden block mb-4 transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100 lazy-loaded' : 'opacity-0'
        }`}
        aria-hidden={imageLoaded ? undefined : 'true'}
      >
        <source type="image/webp" srcSet="/mobile-sim.webp" />
        <img
          src="/mobile-sim.jpg"
          alt="CodeMachine simulation window showing installation, telemetry, and performance metrics"
          loading="lazy"
          decoding="async"
          width="750"
          height="563"
          sizes="(max-width: 768px) 100vw, 750px"
          fetchPriority="low"
          onLoad={handleImageLoad}
          className="w-full rounded-2xl lazy-placeholder lazy-img-4-3 will-change-opacity"
          style={{ aspectRatio: '4/3' }}
        />
      </picture>

      {/* Desktop Simulation Window */}
      <div
        className={`hidden md:block transition-all duration-700 motion-reduce:transition-none motion-reduce:transform-none ${
          revealActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
        style={{
          transform: reducedMotion
            ? 'none'
            : revealActive
              ? 'perspective(1000px) rotateX(0deg)'
              : 'perspective(1000px) rotateX(5deg)',
        }}
      >
        {/* Glass Container */}
        <div className="glass-surface rounded-2xl p-6 shadow-2xl border-white/10">
          {/* Window Chrome */}
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            </div>
            <p className="text-xs text-neutral-500 ml-4 font-mono">
              codemachine-simulation.terminal
            </p>
          </div>

          {/* Panes Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {panes.map((pane, index) => {
              const Icon = iconMap[pane.icon]
              const accentClass = accentColorMap[pane.accent]
              const glowClass = glowColorMap[pane.accent]

              return (
                <div
                  key={pane.id}
                  className={`glass-surface rounded-lg p-4 border ${accentClass} ${glowClass} transition-all duration-500 ${
                    idleAnimationsReady && !reducedMotion
                      ? 'will-change-transform'
                      : ''
                  }`}
                  style={
                    reducedMotion
                      ? {
                          opacity: 1,
                          transform: 'none',
                          transitionDelay: '0ms',
                        }
                      : {
                          transitionDelay: revealActive
                            ? `${index * 100}ms`
                            : '0ms',
                          opacity: revealActive ? 1 : 0,
                          transform: revealActive
                            ? 'translateY(0)'
                            : 'translateY(20px)',
                        }
                  }
                >
                  {/* Pane Header */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-mono uppercase tracking-wider">
                      {pane.label}
                    </span>
                  </div>

                  {/* Pane Content */}
                  <div className="font-mono text-xs leading-relaxed space-y-1">
                    {pane.content.map((line, lineIndex) => (
                      <div
                        key={lineIndex}
                        className={
                          line.startsWith('✓') || line.includes('Success')
                            ? 'text-emerald-400'
                            : line.startsWith('$')
                              ? 'text-primary-300'
                              : line.startsWith('[')
                                ? 'text-blue-300'
                                : line.startsWith('⚡')
                                  ? 'text-yellow-400'
                                  : 'text-neutral-400'
                        }
                      >
                        {line || '\u00A0'}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Metrics Bar */}
          <div className="flex flex-wrap gap-4 pt-4 border-t border-white/5">
            {metrics.map((metric, index) => (
              <div
                key={metric.label}
                className="flex-1 min-w-[140px]"
                style={
                  reducedMotion
                    ? {
                        opacity: 1,
                        transform: 'none',
                        transitionDelay: '0ms',
                        transition: 'none',
                      }
                    : {
                        transitionDelay: revealActive
                          ? `${(panes.length + index) * 100}ms`
                          : '0ms',
                        opacity: revealActive ? 1 : 0,
                        transform: revealActive ? 'scale(1)' : 'scale(0.95)',
                        transition: 'all 0.5s',
                      }
                }
              >
                <p className="label-telemetry text-neutral-500 mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-light text-gradient-primary mb-1">
                  {metric.value}
                </p>
                <p className="text-xs text-neutral-500">{metric.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ambient Glow Effect */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary-500/10 rounded-full blur-[100px] pointer-events-none -z-10"
          style={{
            opacity: reducedMotion ? 0.2 : revealActive ? 0.4 : 0,
            transition: reducedMotion ? 'none' : 'opacity 1s ease-out',
          }}
        />
      </div>
    </section>
  )
}
