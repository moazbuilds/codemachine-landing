/**
 * AnimatedBackground Component
 *
 * Full-screen animated background with:
 * - Glowing orbs with blur effects
 * - Smooth animations and transitions
 * - Grid overlay
 *
 * Inspired by modern landing page designs with interactive backgrounds
 */

/**
 * AnimatedBackground - Full-screen background with glowing orbs
 */
export function AnimatedBackground() {

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Terminal-style gradient orbs - Cyan/Green theme */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/10 via-cyan-400/5 to-transparent rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-gradient-to-tl from-cyan-400/8 via-green-400/4 to-transparent rounded-full blur-[120px] animate-pulse-slower" />
      <div className="absolute top-[40%] right-[20%] w-[600px] h-[600px] bg-gradient-to-br from-cyan-300/6 via-teal-400/3 to-transparent rounded-full blur-[80px] animate-float" />

      {/* Medium glowing orbs - Terminal glow effect */}
      <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] bg-cyan-500/8 rounded-full blur-[60px] animate-float-delayed" />
      <div className="absolute bottom-[30%] left-[15%] w-[400px] h-[400px] bg-green-400/6 rounded-full blur-[70px] animate-float" />

      {/* Radial gradient vignette - Darker for terminal feel */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-navy-950/80" />
    </div>
  )
}
