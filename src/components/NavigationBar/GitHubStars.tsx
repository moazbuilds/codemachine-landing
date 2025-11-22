/**
 * GitHubStars Component - Premium Edition with Advanced Caching
 * Hero navigation element with GitHub branding and real-time stars
 *
 * Features:
 * - Uses advanced useGitHubStars hook with 6-hour localStorage caching
 * - Retry logic and rate limit handling
 * - Non-blocking fetch via requestIdleCallback
 * - Feature flag support (enableGithubStars)
 * - Optional authentication for higher rate limits
 * - Premium glass-morphic design with glow effects
 * - Smooth animations and hover states
 * - Loading shimmer and error fallback
 * - Analytics tracking on click
 */

import { Star, Github } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { useGitHubStars } from '@/hooks/useGitHubStars'
import { isFeatureEnabled } from '@/content/flags'

interface GitHubStarsProps {
  repoUrl: string
  className?: string
}

/**
 * Format star count for display
 * Examples: 123 -> "123", 1234 -> "1.2k", 12345 -> "12.3k"
 */
function formatStarCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

/**
 * Extract owner/repo from GitHub URL
 * Example: https://github.com/moazbuilds/CodeMachine-CLI -> "moazbuilds/CodeMachine-CLI"
 */
function parseGitHubUrl(url: string): string | null {
  try {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/)
    if (!match) return null
    return match[1]
  } catch {
    return null
  }
}

export function GitHubStars({ repoUrl, className = '' }: GitHubStarsProps) {
  const repo = parseGitHubUrl(repoUrl)
  const enabled = isFeatureEnabled('enableGithubStars')

  const { starCount, isLoading, error } = useGitHubStars({
    repo: repo ?? '',
    enabled: enabled && repo !== null,
  })

  const handleClick = () => {
    trackEvent('github_stars_click', {
      url: repoUrl,
      stars: starCount ?? 'unknown',
      location: 'navigation',
    })
  }

  // Show loading state with shimmer
  if (isLoading) {
    return (
      <div
        className={`relative group ${className}`}
        aria-label="Loading GitHub stars"
      >
        {/* Animated glow background - Cyan branding */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-cyan-400/30 to-cyan-500/30 rounded-xl blur-lg opacity-50 animate-pulse" />

        {/* Main container - Transparent */}
        <div className="relative flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
          {/* GitHub Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full" />
            <Github className="w-5 h-5 text-white relative z-10" aria-hidden="true" />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />

          {/* Loading shimmer */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-4 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  // Show error state with fallback
  if (error || starCount === null) {
    return (
      <a
        href={repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`relative group ${className}`}
        aria-label="Star on GitHub (star count unavailable)"
      >
        {/* Hover glow effect - Cyan branding */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 via-cyan-400/30 to-cyan-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Main container - Transparent */}
        <div className="relative flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/20 group-hover:border-cyan-400/60 rounded-xl shadow-lg transition-all duration-300">
          {/* GitHub Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Github className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform" aria-hidden="true" />
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent group-hover:via-cyan-400/60 transition-colors" />

          {/* Star CTA */}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400 group-hover:fill-yellow-400 transition-all" aria-hidden="true" />
            <span className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors">
              Star
            </span>
          </div>
        </div>
      </a>
    )
  }

  // Show premium star count display
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`relative group ${className}`}
      aria-label={`${starCount} stars on GitHub (opens in new tab)`}
    >
      {/* Animated glow background on hover - Cyan branding */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/40 via-cyan-400/50 to-cyan-500/40 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main container - Transparent glass */}
      <div className="relative flex items-center gap-3 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/20 group-hover:border-cyan-400/60 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
        {/* GitHub Logo with cyan glow */}
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Github
            className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300"
            aria-hidden="true"
          />
        </div>

        {/* Animated divider */}
        <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent group-hover:via-cyan-400/60 transition-colors" />

        {/* Star count section */}
        <div className="flex items-center gap-2.5">
          <Star
            className="w-4 h-4 text-yellow-400 group-hover:fill-yellow-400 group-hover:scale-110 transition-all duration-300"
            aria-hidden="true"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors leading-none">
              {formatStarCount(starCount)}
            </span>
            <span className="text-[10px] text-neutral-400 group-hover:text-neutral-300 transition-colors leading-none mt-0.5">
              stars
            </span>
          </div>
        </div>

        {/* Subtle shine effect on hover */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />
        </div>
      </div>
    </a>
  )
}
