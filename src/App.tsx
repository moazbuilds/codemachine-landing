import type { LucideIcon } from 'lucide-react'
import { Sparkles, Terminal, Zap } from 'lucide-react'
import { featureCards, heroContent } from '@/content'
import type { IconKey } from '@/content'

const iconMap: Record<IconKey, LucideIcon> = {
  sparkles: Sparkles,
  zap: Zap,
  terminal: Terminal,
}

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-8 noise-texture">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="ambient-glow w-96 h-96 bg-primary-600/20 -top-48 -left-48"
      />
      <div
        aria-hidden="true"
        className="ambient-glow w-96 h-96 bg-blue-500/20 -bottom-48 -right-48"
      />

      {/* Main content card */}
      <div className="glass-card rounded-xl p-12 max-w-2xl relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-lg bg-primary-500/10 border border-primary-500/20">
            <Terminal className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <p className="label-telemetry text-neutral-500">
              {heroContent.kicker}
            </p>
            <h1 className="heading-section text-gradient-primary">
              {heroContent.title}
            </h1>
          </div>
        </div>

        <p className="body-long text-neutral-400 mb-8">
          {heroContent.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureCards.map((card) => {
            const Icon = iconMap[card.icon]
            const accentClass =
              card.accent === 'primary'
                ? 'text-primary-400'
                : 'text-emerald-400'

            return (
              <div
                key={card.id}
                className="glass-surface rounded-lg p-6 inner-glow"
              >
                <Icon className={`w-6 h-6 mb-3 ${accentClass}`} />
                <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                <p className="text-sm text-neutral-400">{card.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex gap-4">
          <button type="button" className="btn-primary">
            {heroContent.ctas.primary}
          </button>
          <button type="button" className="btn-secondary">
            {heroContent.ctas.secondary}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="label-telemetry text-neutral-500">
            {heroContent.telemetryLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
