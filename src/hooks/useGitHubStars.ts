/**
 * useGitHubStars Hook
 * Manages GitHub star count fetching with caching, retries, and fallback logic.
 *
 * Architecture (I2.T3):
 * - Fetches stars via requestIdleCallback to avoid blocking main thread
 * - Caches results in localStorage with configurable TTL (default 6h)
 * - Implements retry logic via github.ts client (max 2 attempts)
 * - Falls back to placeholder copy on error
 * - Emits metric update events for subscribers
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { buildFallbackStarCopy } from '@/content'
import {
  fetchGitHubStarsWithRetry,
  GitHubRateLimitError,
  GitHubRequestTimeoutError,
} from '@/lib/github'
import { trackEvent } from '@/lib/analytics'

const DEFAULT_CACHE_HOURS = 6

function resolveCacheHours(override?: number): number {
  if (
    typeof override === 'number' &&
    Number.isFinite(override) &&
    override > 0
  ) {
    return override
  }

  const envValueRaw = import.meta.env.VITE_GITHUB_STARS_TTL_HOURS
  if (typeof envValueRaw === 'string' && envValueRaw.trim().length > 0) {
    const parsed = Number(envValueRaw)
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed
    }
  }

  return DEFAULT_CACHE_HOURS
}

function getRepoName(repo: string): string {
  return repo.split('/').filter(Boolean).pop() ?? repo
}

/**
 * Cached star metric structure stored in localStorage
 */
interface CachedStarMetric {
  label: string
  count: number
  timestamp: number
  fallbackCopy: string
}

/**
 * Hook configuration options
 */
interface UseGitHubStarsOptions {
  /** Repository in format "owner/repo" */
  repo: string
  /** Cache duration in hours (default: 6) */
  cacheHours?: number
  /** Optional callback when fresh metric is fetched */
  onMetricUpdate?: (metric: CachedStarMetric) => void
  /** Feature flag to enable/disable live fetching */
  enabled?: boolean
}

/**
 * Hook return value
 */
interface UseGitHubStarsReturn {
  /** Current star count (null if loading or error) */
  starCount: number | null
  /** Loading state */
  isLoading: boolean
  /** Error state (null if no error) */
  error: Error | null
  /** Last update timestamp (null if never fetched) */
  lastUpdated: number | null
  /** Whether using cached data */
  isStale: boolean
}

/**
 * Generate localStorage cache key for a repository
 */
function getCacheKey(repo: string): string {
  return `codemachine:metric:github-stars:${repo}`
}

/**
 * Read cached metric from localStorage
 */
function readCache(repo: string): CachedStarMetric | null {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null
    }

    const key = getCacheKey(repo)
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const parsed = JSON.parse(cached) as CachedStarMetric
    return parsed
  } catch (error) {
    console.warn('[useGitHubStars] Failed to read cache:', error)
    return null
  }
}

/**
 * Write metric to localStorage cache
 */
function writeCache(repo: string, metric: CachedStarMetric): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return
    }

    const key = getCacheKey(repo)
    localStorage.setItem(key, JSON.stringify(metric))
  } catch (error) {
    // Handle quota exceeded or other storage errors gracefully
    console.warn('[useGitHubStars] Failed to write cache:', error)
  }
}

/**
 * Check if cached data is stale based on TTL
 */
function isCacheStale(cached: CachedStarMetric, ttlHours: number): boolean {
  const now = Date.now()
  const age = now - cached.timestamp
  const ttlMs = ttlHours * 60 * 60 * 1000
  return age >= ttlMs
}

/**
 * Custom hook to fetch and cache GitHub star counts.
 *
 * @param options - Configuration options
 * @returns Star count state and metadata
 *
 * @example
 * ```tsx
 * function StarBadge() {
 *   const { starCount, isLoading } = useGitHubStars({
 *     repo: 'moazbuilds/CodeMachine-CLI',
 *     onMetricUpdate: (metric) => console.log('Updated:', metric)
 *   })
 *
 *   if (isLoading) return <span>Loading...</span>
 *   return <span>{starCount ?? '100+'} Stars</span>
 * }
 * ```
 */
export function useGitHubStars(
  options: UseGitHubStarsOptions
): UseGitHubStarsReturn {
  const {
    repo,
    cacheHours,
    onMetricUpdate,
    enabled = true,
  } = options
  const resolvedCacheHours = resolveCacheHours(cacheHours)

  const [starCount, setStarCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [isStale, setIsStale] = useState<boolean>(false)

  // Use ref to track if component is mounted (avoid state updates after unmount)
  const isMountedRef = useRef(true)
  const fetchInProgressRef = useRef(false)

  /**
   * Fetch stars from GitHub API with retry logic
   */
  const fetchStars = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchInProgressRef.current) {
      console.info('[useGitHubStars] Fetch already in progress, skipping')
      return
    }

    if (!enabled) {
      console.info('[useGitHubStars] Feature disabled, skipping fetch')
      return
    }

    fetchInProgressRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      // Get optional GitHub token from environment
      const token = import.meta.env.VITE_GITHUB_TOKEN

      // Fetch with retry logic (max 2 attempts per github.ts)
      const count = await fetchGitHubStarsWithRetry(repo, token, 2)

      // Only update state if still mounted
      if (isMountedRef.current) {
        const fallbackCopy = buildFallbackStarCopy(getRepoName(repo))
        const metric: CachedStarMetric = {
          label: repo,
          count,
          timestamp: Date.now(),
          fallbackCopy,
        }

        setStarCount(count)
        setLastUpdated(metric.timestamp)
        setIsStale(false)
        setError(null)

        // Persist to cache
        writeCache(repo, metric)

        // Notify subscribers
        onMetricUpdate?.(metric)

        console.info(`[useGitHubStars] Successfully fetched and cached ${count} stars`)
        trackEvent('github_stars_fetch', {
          repo,
          source: 'network',
          count,
        })
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')

      if (isMountedRef.current) {
        setError(error)

        // Log different error types appropriately
        if (error instanceof GitHubRateLimitError) {
          console.warn('[useGitHubStars] Rate limit exceeded:', error.message)
        } else if (error instanceof GitHubRequestTimeoutError) {
          console.warn('[useGitHubStars] Request timed out:', error.message)
        } else {
          console.warn('[useGitHubStars] Fetch failed:', error.message)
        }

        trackEvent('github_stars_fallback', {
          repo,
          reason: error.name ?? 'unknown',
        })
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
      fetchInProgressRef.current = false
    }
  }, [repo, enabled, onMetricUpdate])

  /**
   * Schedule fetch using requestIdleCallback (non-blocking)
   */
  const scheduleFetch = useCallback(() => {
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(
        () => {
          fetchStars()
        },
        { timeout: 2000 } // Fallback to normal execution after 2s
      )
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(fetchStars, 100)
    }
  }, [fetchStars])

  /**
   * Initialize hook: check cache and fetch if needed
   */
  useEffect(() => {
    // Check cache first
    const cached = readCache(repo)

    if (cached) {
      // Use cached data immediately
      setStarCount(cached.count)
      setLastUpdated(cached.timestamp)
      setIsLoading(false)

      const stale = isCacheStale(cached, resolvedCacheHours)
      setIsStale(stale)

      if (stale) {
        console.info('[useGitHubStars] Cache is stale, scheduling refresh')
        scheduleFetch()
        trackEvent('github_stars_fetch', {
          repo,
          source: 'cache_stale',
          count: cached.count,
        })
      } else {
        console.info('[useGitHubStars] Using fresh cache')
        trackEvent('github_stars_fetch', {
          repo,
          source: 'cache_fresh',
          count: cached.count,
        })
      }
    } else {
      // No cache, fetch immediately
      console.info('[useGitHubStars] No cache found, scheduling fetch')
      scheduleFetch()
    }

    // Cleanup: mark component as unmounted
    return () => {
      isMountedRef.current = false
    }
  }, [repo, resolvedCacheHours, scheduleFetch])

  return {
    starCount,
    isLoading,
    error,
    lastUpdated,
    isStale,
  }
}
