/**
 * BackgroundLayers Component
 * Referenced by: src/components/ExperienceShell/index.tsx:*
 *
 * Renders the Aura-themed background layers including:
 * - Noise texture overlay (from index.css)
 * - Ambient glows positioned at different corners
 * - Base gradient background
 *
 * Uses utilities from src/index.css (.noise-texture, .ambient-glow)
 * and design tokens from src/styles/tokens.css
 */

export function BackgroundLayers() {
  return (
    <>
      {/* Top-left ambient glow */}
      <div
        aria-hidden="true"
        className="ambient-glow w-96 h-96 bg-primary-600/20 -top-48 -left-48"
        style={{ zIndex: 'var(--z-background)' }}
      />

      {/* Bottom-right ambient glow */}
      <div
        aria-hidden="true"
        className="ambient-glow w-96 h-96 bg-blue-500/20 -bottom-48 -right-48"
        style={{ zIndex: 'var(--z-background)' }}
      />

      {/* Additional accent glow - center-right for depth */}
      <div
        aria-hidden="true"
        className="ambient-glow w-80 h-80 bg-primary-500/15 top-1/2 -right-32 -translate-y-1/2"
        style={{ zIndex: 'var(--z-background)' }}
      />
    </>
  )
}
