/**
 * GitHub API Client
 * Handles fetching GitHub repository star counts with timeout and retry logic.
 *
 * Architecture (I2.T3):
 * - Implements RESTful GET to GitHub REST API v3
 * - Supports optional authentication via GitHub token
 * - Uses AbortController for request timeout (10s)
 * - Respects rate limiting (403) by throwing specific error
 * - Logs all requests and responses via console.info/warn
 */

/**
 * Configuration for GitHub API requests
 */
const GITHUB_API_BASE = 'https://api.github.com'
const REQUEST_TIMEOUT_MS = 10000 // 10 seconds
const GITHUB_API_VERSION = '2022-11-28'

/**
 * Custom error types for better error handling
 */
export class GitHubRateLimitError extends Error {
  constructor(message = 'GitHub API rate limit exceeded') {
    super(message)
    this.name = 'GitHubRateLimitError'
  }
}

export class GitHubRequestTimeoutError extends Error {
  constructor(message = 'GitHub API request timed out') {
    super(message)
    this.name = 'GitHubRequestTimeoutError'
  }
}

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message)
    this.name = 'GitHubAPIError'
  }
}

/**
 * GitHub API response type for repository endpoint
 */
interface GitHubRepoResponse {
  stargazers_count: number
  name: string
  full_name: string
  // Other fields omitted for brevity
}

/**
 * Fetches the star count for a GitHub repository.
 *
 * @param repo - Repository in format "owner/repo" (e.g., "moazbuilds/CodeMachine-CLI")
 * @param token - Optional GitHub personal access token for authenticated requests
 * @returns Promise resolving to the star count
 * @throws {GitHubRateLimitError} When rate limit is exceeded (403)
 * @throws {GitHubRequestTimeoutError} When request exceeds timeout
 * @throws {GitHubAPIError} For other API errors
 *
 * @example
 * ```ts
 * const stars = await fetchGitHubStars('moazbuilds/CodeMachine-CLI')
 * console.log(`Repository has ${stars} stars`)
 * ```
 */
export async function fetchGitHubStars(
  repo: string,
  token?: string
): Promise<number> {
  const url = `${GITHUB_API_BASE}/repos/${repo}`

  // Create AbortController for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  try {
    console.info(`[GitHub API] Fetching stars for ${repo}`)

    // Build headers
    const headers: HeadersInit = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': GITHUB_API_VERSION,
    }

    // Add optional authentication
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.info('[GitHub API] Using authenticated request')
    }

    // Perform fetch with timeout
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    })

    // Handle rate limiting
    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining')
      const rateLimitReset = response.headers.get('X-RateLimit-Reset')

      console.warn(
        `[GitHub API] Rate limit exceeded. Remaining: ${rateLimitRemaining}, Reset: ${
          rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toISOString() : 'unknown'
        }`
      )

      throw new GitHubRateLimitError(
        `GitHub API rate limit exceeded. Try again after ${
          rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toLocaleTimeString() : 'some time'
        }`
      )
    }

    // Handle other non-OK responses
    if (!response.ok) {
      console.warn(`[GitHub API] Request failed with status ${response.status}`)
      throw new GitHubAPIError(
        `GitHub API request failed: ${response.statusText}`,
        response.status
      )
    }

    // Parse response
    const data = (await response.json()) as GitHubRepoResponse
    const starCount = data.stargazers_count

    console.info(`[GitHub API] Successfully fetched ${starCount} stars for ${repo}`)

    return starCount

  } catch (error) {
    // Handle abort/timeout
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`[GitHub API] Request timed out after ${REQUEST_TIMEOUT_MS}ms`)
      throw new GitHubRequestTimeoutError()
    }

    // Re-throw known errors
    if (
      error instanceof GitHubRateLimitError ||
      error instanceof GitHubAPIError
    ) {
      throw error
    }

    // Handle network errors
    console.warn('[GitHub API] Network error:', error)
    throw new GitHubAPIError(
      error instanceof Error ? error.message : 'Unknown network error'
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Fetches GitHub stars with retry logic.
 *
 * @param repo - Repository in format "owner/repo"
 * @param token - Optional GitHub personal access token
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 * @param retryDelay - Base delay between retries in ms (default: 1000)
 * @returns Promise resolving to the star count
 *
 * @example
 * ```ts
 * const stars = await fetchGitHubStarsWithRetry('moazbuilds/CodeMachine-CLI', undefined, 2)
 * ```
 */
export async function fetchGitHubStarsWithRetry(
  repo: string,
  token?: string,
  maxRetries = 2,
  retryDelay = 1000
): Promise<number> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.info(`[GitHub API] Attempt ${attempt}/${maxRetries}`)
      return await fetchGitHubStars(repo, token)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')

      // Don't retry on rate limit errors
      if (error instanceof GitHubRateLimitError) {
        console.warn('[GitHub API] Rate limit error - skipping retries')
        throw error
      }

      // Log retry attempt
      if (attempt < maxRetries) {
        const delay = retryDelay * attempt // Linear backoff
        console.warn(
          `[GitHub API] Attempt ${attempt} failed, retrying in ${delay}ms...`,
          lastError.message
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  // All retries exhausted
  console.warn(`[GitHub API] All ${maxRetries} attempts failed`)
  throw lastError || new GitHubAPIError('All retry attempts failed')
}
