/**
 * BackgroundLayers Component
 * Referenced by: src/components/ExperienceShell/index.tsx:*
 *
 * Renders terminal-themed background layers including:
 * - Scanline effect
 * - CRT screen curvature
 * - Subtle grid pattern
 * - Terminal glow effect
 */

export function BackgroundLayers() {
  return (
    <>
      {/* Terminal Grid Background - More prominent */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.15]"
        style={{
          zIndex: 0,
          backgroundSize: '20px 20px',
          backgroundImage: 'linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)',
        }}
      />

      {/* Scanline Effect */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* CRT Glow Vignette */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />

      {/* Terminal Green/Cyan Glow */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -1,
          boxShadow: 'inset 0 0 200px rgba(34, 211, 238, 0.05)',
        }}
      />
    </>
  )
}
