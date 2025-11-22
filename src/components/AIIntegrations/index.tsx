/**
 * AIIntegrations Component
 * Displays supported AI engines and technology stack in elegant badges
 *
 * Shows:
 * - Supported AI CLI tools (Claude Code, Cursor, etc.)
 * - Coming soon integrations
 * - Technology stack details
 */

import { aiIntegrations, techStack } from '@/content'

export function AIIntegrations() {
  return (
    <section
      id="integrations"
      className="relative mx-auto max-w-6xl px-6 py-20"
      aria-label="AI Integrations and Technology Stack"
    >
      <div className="flex flex-col items-center gap-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
            AI Engine Integrations
          </h2>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl">
            CodeMachine orchestrates multiple AI CLI tools, letting you leverage the strengths of each engine for different tasks.
          </p>
        </div>

        {/* AI Integrations Grid - Centered */}
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl">
          {aiIntegrations.map((integration) => {
            const isComingSoon = integration.value === 'Coming Soon'

            return (
              <div
                key={integration.label}
                className={`
                  flex flex-col items-center gap-2 p-5
                  bg-white/5 border border-white/10 rounded-lg
                  transition-all duration-300
                  ${isComingSoon
                    ? 'opacity-50'
                    : 'hover:border-cyan-400/40'
                  }
                `}
              >
                {/* Engine Name */}
                <h3 className="text-sm font-medium text-white">
                  {integration.label}
                </h3>
                <p className="text-xs text-neutral-500">
                  {integration.value}
                </p>
              </div>
            )
          })}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Tech Stack */}
        <div className="flex flex-col items-center gap-4 w-full">
          <h3 className="text-sm font-medium text-neutral-400">
            Built With
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.label}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10"
              >
                <span className="text-xs text-neutral-500">
                  {tech.label}:
                </span>
                <span className="text-xs font-medium text-white">
                  {tech.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
