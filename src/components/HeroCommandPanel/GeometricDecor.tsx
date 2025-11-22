/**
 * GeometricDecor Component
 *
 * Wireframe geometric decorations inspired by the CodeMachine banner
 * Features:
 * - Low-poly polyhedron shapes
 * - Circuit board style connection lines
 * - Subtle animations
 */

export function GeometricDecor() {
  return (
    <>
      {/* Left side - Polyhedron wireframe */}
      <div className="absolute left-[5%] top-[20%] w-32 h-32 md:w-48 md:h-48 opacity-20 animate-float-delayed pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Low-poly wireframe shape */}
          <path
            d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z"
            stroke="#6b9bd1"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M100 20 L100 180" stroke="#6b9bd1" strokeWidth="1" opacity="0.5" />
          <path d="M30 60 L170 140" stroke="#6b9bd1" strokeWidth="1" opacity="0.5" />
          <path d="M170 60 L30 140" stroke="#6b9bd1" strokeWidth="1" opacity="0.5" />
          <path d="M100 20 L30 140" stroke="#6b9bd1" strokeWidth="1" opacity="0.3" />
          <path d="M100 20 L170 140" stroke="#6b9bd1" strokeWidth="1" opacity="0.3" />
          <circle cx="100" cy="20" r="3" fill="#8fb4e0" />
          <circle cx="170" cy="60" r="3" fill="#8fb4e0" />
          <circle cx="170" cy="140" r="3" fill="#8fb4e0" />
          <circle cx="100" cy="180" r="3" fill="#8fb4e0" />
          <circle cx="30" cy="140" r="3" fill="#8fb4e0" />
          <circle cx="30" cy="60" r="3" fill="#8fb4e0" />
        </svg>
      </div>

      {/* Right side - Circuit lines */}
      <div className="absolute right-[8%] top-[25%] w-48 h-32 md:w-64 md:h-48 opacity-15 pointer-events-none">
        <svg viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Horizontal lines with angles */}
          <path d="M0 40 L80 40 L100 20 L280 20" stroke="#6b9bd1" strokeWidth="1.5" />
          <path d="M0 80 L120 80 L140 100 L300 100" stroke="#6b9bd1" strokeWidth="1.5" />
          <path d="M50 140 L180 140 L200 160 L300 160" stroke="#6b9bd1" strokeWidth="1.5" />

          {/* Connection nodes */}
          <circle cx="80" cy="40" r="2.5" fill="#8fb4e0" />
          <circle cx="100" cy="20" r="2.5" fill="#8fb4e0" />
          <circle cx="120" cy="80" r="2.5" fill="#8fb4e0" />
          <circle cx="140" cy="100" r="2.5" fill="#8fb4e0" />
          <circle cx="180" cy="140" r="2.5" fill="#8fb4e0" />
          <circle cx="200" cy="160" r="2.5" fill="#8fb4e0" />
        </svg>
      </div>

      {/* Bottom left - Small geometric accent */}
      <div className="absolute left-[10%] bottom-[15%] w-24 h-24 opacity-10 animate-float pointer-events-none hidden md:block">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,10 90,35 90,65 50,90 10,65 10,35" stroke="#6b9bd1" strokeWidth="1.5" fill="none" />
          <path d="M50 10 L50 90" stroke="#6b9bd1" strokeWidth="1" opacity="0.4" />
          <path d="M10 35 L90 65" stroke="#6b9bd1" strokeWidth="1" opacity="0.4" />
        </svg>
      </div>
    </>
  )
}
