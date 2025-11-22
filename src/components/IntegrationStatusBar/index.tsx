/**
 * IntegrationStatusBar Component
 * Displays GitHub star count badge with live fetching, caching, and fallback.
 *
 * Architecture (I2.T3):
 * - Consumes useGitHubStars hook for data fetching
 * - Renders glassmorphic badge matching Aura theme
 * - Shows skeleton state while loading
 * - Falls back to "100+ Stars" on error
 * - Announces updates via aria-live (accessibility)
 * - Respects prefers-reduced-motion
 */

import { useEffect, useRef, useState } from 'react'
import { useGitHubStars } from '@/hooks/useGitHubStars'
import { buildFallbackStarCopy, isFeatureEnabled } from '@/content'
import { trackEvent } from '@/lib/analytics'

/**
 * Component props
 */
interface IntegrationStatusBarProps {
  /** Repository in format "owner/repo" (default: moazbuilds/CodeMachine-CLI) */
  repo?: string
  /** Custom fallback label when fetch fails */
  fallbackLabel?: string
  /** Cache duration in hours (default: 6) */
  cacheHours?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * Format star count for display (e.g., 1234 -> "1.2k")
 */
function formatStarCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }
  return count.toString()
}

/**
 * IntegrationStatusBar displays a live GitHub star count badge.
 *
 * @example
 * ```tsx
 * <IntegrationStatusBar repo="moazbuilds/CodeMachine-CLI" />
 * ```
 */
export function IntegrationStatusBar({
  repo = 'moazbuilds/CodeMachine-CLI',
  fallbackLabel,
  cacheHours,
  className = '',
}: IntegrationStatusBarProps) {
  const repoName = repo.split('/').filter(Boolean).pop() ?? repo
  const fallbackCopy = fallbackLabel ?? buildFallbackStarCopy(repoName)
  const repoUrl = `https://github.com/${repo}`

  // Check if GitHub stars feature is enabled
  const githubStarsEnabled = isFeatureEnabled('enableGithubStars')

  // Fetch star count with hook
  const { starCount, isLoading, error, isStale } = useGitHubStars({
    repo,
    cacheHours,
    enabled: githubStarsEnabled,
    onMetricUpdate: (metric) => {
      console.info('[IntegrationStatusBar] Metric updated:', metric)
    },
  })

  // Track previous star count for aria-live updates
  const prevStarCountRef = useRef<number | null>(null)
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>('')

  /**
   * Update aria-live message only when star count changes
   */
  useEffect(() => {
    if (starCount !== null && starCount !== prevStarCountRef.current) {
      setAriaLiveMessage(`GitHub stars updated: ${formatStarCount(starCount)}`)
      prevStarCountRef.current = starCount
    }
  }, [starCount])

  /**
   * Determine display content based on state
   */
  const getDisplayContent = () => {
    // If feature disabled, show fallback
    if (!githubStarsEnabled) {
      return fallbackCopy
    }

    // If loading and no cached data, show skeleton
    if (isLoading && starCount === null) {
      return null // Render skeleton
    }

    // If error, show fallback
    if (error) {
      return fallbackCopy
    }

    // If we have a star count, show it
    if (starCount !== null) {
      return `${formatStarCount(starCount)} Stars`
    }

    // Default fallback
    return fallbackCopy
  }

  const displayContent = getDisplayContent()
  const handleBadgeClick = () => {
    trackEvent('github_star_click', {
      repo,
      state: error ? 'error' : isStale ? 'stale' : 'live',
      stars: starCount ?? undefined,
    })
  }

  /**
   * Render skeleton loading state
   */
  if (displayContent === null) {
    return (
      <div
        className={`glass-surface inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 shadow-lg ${className}`}
        aria-label="Loading GitHub stars"
        role="status"
      >
        {/* Star icon skeleton */}
        <div className="h-4 w-4 animate-pulse rounded-full bg-white/20" />
        {/* Text skeleton */}
        <div className="h-4 w-20 animate-pulse rounded bg-white/20" />
      </div>
    )
  }

  /**
   * Render badge with star count or fallback
   */
  return (
    <a
      href={repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleBadgeClick}
      className={`glass-surface inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 shadow-lg transition-opacity duration-300 focus-ring-aura ${className}`}
      aria-label={`Open GitHub repository (${displayContent})`}
    >
      {/* Star icon */}
      <svg
        className={`h-4 w-4 ${
          error ? 'text-neutral-400' : 'text-primary-400'
        } ${isStale ? 'opacity-70' : 'opacity-100'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>

      {/* Star count text */}
      <span
        className={`text-sm font-medium ${
          error ? 'text-neutral-400' : 'text-neutral-200'
        }`}
      >
        {displayContent}
      </span>

      {/* Stale indicator (optional subtle pulse) */}
      {isStale && !error && starCount !== null && (
        <span
          className="ml-1 h-2 w-2 rounded-full bg-primary-400/50 motion-safe:animate-pulse"
          aria-label="Updating star count"
          title="Refreshing..."
        />
      )}

      {/* Aria-live region for screen readers (only announces when value changes) */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {ariaLiveMessage}
      </span>
    </a>
  )
}
