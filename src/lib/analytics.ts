/**
 * Analytics Helper
 * Task: I2.T4 - Centralized event tracking with debouncing
 *
 * Provides a unified interface for capturing user interactions:
 * - Copy-to-clipboard events
 * - Documentation link clicks
 * - GitHub star badge interactions
 *
 * Features:
 * - Automatic event debouncing to prevent duplicate tracking
 * - Graceful degradation when analytics backend unavailable
 * - Console fallback for development/debugging
 * - Type-safe event metadata
 *
 * Future Integration:
 * - PostHog endpoint (when VITE_ANALYTICS_ENDPOINT configured)
 * - Network offline detection
 * - Batch event queuing
 *
 * Usage:
 * ```tsx
 * import { trackEvent } from '@/lib/analytics'
 *
 * trackEvent('hero_copy_success', {
 *   command: 'npm install codemachine-cli',
 *   method: 'clipboard_api'
 * })
 * ```
 */

/**
 * Event metadata - strongly typed properties for analytics events
 */
export interface EventMetadata {
  [key: string]: string | number | boolean | undefined
}

/**
 * Known event names for type safety
 * Extend this type as new events are added
 */
export type EventName =
  | 'hero_copy_success'
  | 'hero_copy_fallback'
  | 'hero_docs_click'
  | 'github_star_click'
  | 'github_stars_fetch'
  | 'github_stars_fallback'
  | 'simulation_play'
  | 'simulation_pause'
  | string // Allow custom events

/**
 * Debounce entry tracking event timestamp
 */
interface DebounceEntry {
  timestamp: number
  metadata: EventMetadata
}

/**
 * Configuration for analytics system
 */
interface AnalyticsConfig {
  /**
   * Whether analytics is enabled
   * Defaults to true, can be disabled via feature flag
   */
  enabled: boolean

  /**
   * Debounce window in milliseconds
   * Prevents duplicate events within this timeframe
   * Default: 1000ms (1 second)
   */
  debounceMs: number

  /**
   * Whether to log events to console
   * Useful for development and debugging
   * Default: true in development, false in production
   */
  logToConsole: boolean

  /**
   * Analytics backend endpoint (e.g., PostHog)
   * If not configured, events only log to console
   */
  endpoint?: string
}

// Default configuration
const defaultConfig: AnalyticsConfig = {
  enabled: true,
  debounceMs: 1000,
  logToConsole: import.meta.env.DEV,
  endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
}

// Current configuration (can be updated via setAnalyticsConfig)
let currentConfig: AnalyticsConfig = { ...defaultConfig }

/**
 * Debounce cache: Map<eventKey, DebounceEntry>
 * eventKey format: `${eventName}:${JSON.stringify(metadata)}`
 */
const debounceCache = new Map<string, DebounceEntry>()

/**
 * Update analytics configuration
 * @param config - Partial configuration to merge with defaults
 */
export function setAnalyticsConfig(config: Partial<AnalyticsConfig>): void {
  currentConfig = { ...currentConfig, ...config }
}

/**
 * Get current analytics configuration
 * @returns Current AnalyticsConfig
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  return { ...currentConfig }
}

/**
 * Generate cache key for debouncing
 * Combines event name and metadata for uniqueness
 */
function generateCacheKey(
  eventName: EventName,
  metadata?: EventMetadata
): string {
  if (!metadata || Object.keys(metadata).length === 0) {
    return eventName
  }

  // Sort keys for consistent hashing
  const sortedMetadata = Object.keys(metadata)
    .sort()
    .reduce(
      (acc, key) => {
        acc[key] = metadata[key]
        return acc
      },
      {} as EventMetadata
    )

  return `${eventName}:${JSON.stringify(sortedMetadata)}`
}

/**
 * Check if event should be debounced (duplicate within debounce window)
 * @returns true if event is a duplicate, false if it should be tracked
 */
function shouldDebounce(
  cacheKey: string,
  metadata: EventMetadata = {}
): boolean {
  const now = Date.now()
  const cached = debounceCache.get(cacheKey)

  if (!cached) {
    // First occurrence, not a duplicate
    debounceCache.set(cacheKey, { timestamp: now, metadata })
    return false
  }

  const timeSinceLastEvent = now - cached.timestamp

  if (timeSinceLastEvent < currentConfig.debounceMs) {
    // Duplicate within debounce window
    return true
  }

  // Outside debounce window, update cache and allow tracking
  debounceCache.set(cacheKey, { timestamp: now, metadata })
  return false
}

/**
 * Send event to analytics backend
 * Currently no-ops if endpoint not configured
 */
async function sendToBackend(
  eventName: EventName,
  metadata: EventMetadata
): Promise<void> {
  if (!currentConfig.endpoint) {
    // No backend configured, skip network request
    return
  }

  try {
    // Future implementation: POST to analytics endpoint
    // await fetch(currentConfig.endpoint, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     event: eventName,
    //     properties: metadata,
    //     timestamp: new Date().toISOString(),
    //   }),
    // })

    // Placeholder for future backend integration
    console.debug(
      `[Analytics Backend] Would send to ${currentConfig.endpoint}:`,
      { eventName, metadata }
    )
  } catch (error) {
    // Silently fail - analytics errors should not break user experience
    console.warn('[Analytics] Failed to send event:', error)
  }
}

/**
 * Track an analytics event
 *
 * Features:
 * - Automatic debouncing to prevent duplicate events
 * - Console logging in development mode
 * - Optional backend integration
 * - Graceful failure handling
 *
 * @param eventName - Name of the event to track
 * @param metadata - Optional event properties
 *
 * @example
 * ```tsx
 * // Simple event
 * trackEvent('hero_copy_success')
 *
 * // Event with metadata
 * trackEvent('hero_docs_click', {
 *   url: 'https://docs.codemachine.co',
 *   label: 'Read Documentation'
 * })
 * ```
 */
export function trackEvent(
  eventName: EventName,
  metadata?: EventMetadata
): void {
  // Skip if analytics disabled
  if (!currentConfig.enabled) {
    return
  }

  const cleanMetadata: EventMetadata = metadata || {}
  const cacheKey = generateCacheKey(eventName, cleanMetadata)

  // Check debounce cache
  if (shouldDebounce(cacheKey, cleanMetadata)) {
    if (currentConfig.logToConsole) {
      console.debug(
        `[Analytics] Debounced duplicate event: ${eventName}`,
        cleanMetadata
      )
    }
    return
  }

  // Log to console if enabled
  if (currentConfig.logToConsole) {
    console.log(`[Analytics Event] ${eventName}`, cleanMetadata)
  }

  // Send to backend (async, fire-and-forget)
  void sendToBackend(eventName, cleanMetadata)
}

/**
 * Clear debounce cache
 * Useful for testing or manual cache invalidation
 */
export function clearDebounceCache(): void {
  debounceCache.clear()
}

/**
 * Disable analytics tracking
 * Shorthand for setAnalyticsConfig({ enabled: false })
 */
export function disableAnalytics(): void {
  setAnalyticsConfig({ enabled: false })
}

/**
 * Enable analytics tracking
 * Shorthand for setAnalyticsConfig({ enabled: true })
 */
export function enableAnalytics(): void {
  setAnalyticsConfig({ enabled: true })
}
