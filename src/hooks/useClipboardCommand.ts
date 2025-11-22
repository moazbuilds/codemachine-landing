/**
 * useClipboardCommand Hook
 * Task: I2.T1 - HeroCommandPanel Implementation
 *
 * Manages clipboard copy operations with automatic fallback to text selection.
 * Implements a three-state machine (idle → copying → success/error) with
 * automatic timeout resets and browser compatibility handling.
 *
 * Acceptance Criteria:
 * - Copies to clipboard within 150ms or falls back to text selection
 * - Provides clear status states for UI feedback
 * - Handles permission denials and API unavailability
 * - Respects document visibility to avoid jitter
 */

import { useCallback, useRef, useState, useEffect } from 'react'

type ClipboardStatus = 'idle' | 'copying' | 'success' | 'error'

interface UseClipboardCommandOptions {
  /**
   * The command text to copy to the clipboard
   */
  command: string

  /**
   * Timeout in milliseconds before resetting status to idle
   * @default 2000
   */
  resetTimeout?: number

  /**
   * Callback invoked when copy succeeds
   */
  onSuccess?: () => void

  /**
   * Callback invoked when copy fails (triggers fallback)
   */
  onError?: (error: Error) => void
}

interface UseClipboardCommandReturn {
  /**
   * Current status of the clipboard operation
   */
  status: ClipboardStatus

  /**
   * Ref to attach to the command element for fallback text selection
   */
  commandRef: React.RefObject<HTMLElement>

  /**
   * Triggers the copy operation
   */
  copy: () => Promise<void>

  /**
   * Manually reset status to idle
   */
  reset: () => void
}

/**
 * Custom hook for clipboard copy operations with fallback support.
 *
 * @example
 * ```tsx
 * const { status, commandRef, copy } = useClipboardCommand({
 *   command: 'npm install codemachine',
 *   onSuccess: () => console.log('Copied!'),
 *   onError: (err) => console.error(err)
 * })
 *
 * return (
 *   <div>
 *     <code ref={commandRef}>{command}</code>
 *     <button onClick={copy}>Copy</button>
 *   </div>
 * )
 * ```
 */
export function useClipboardCommand({
  command,
  resetTimeout = 2000,
  onSuccess,
  onError,
}: UseClipboardCommandOptions): UseClipboardCommandReturn {
  const [status, setStatus] = useState<ClipboardStatus>('idle')
  const commandRef = useRef<HTMLElement>(null)
  const timeoutRef = useRef<number | null>(null)

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Reset status to idle after timeout
  const scheduleReset = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setStatus('idle')
      timeoutRef.current = null
    }, resetTimeout)
  }, [resetTimeout])

  // Manual reset function
  const reset = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setStatus('idle')
  }, [])

  // Main copy function
  const copy = useCallback(async () => {
    // Skip if already in progress or document is hidden
    if (status === 'copying' || document.visibilityState === 'hidden') {
      return
    }

    setStatus('copying')

    try {
      // Attempt modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(command)
        setStatus('success')
        onSuccess?.()
        scheduleReset()
      } else {
        // Clipboard API not available, throw to trigger fallback
        throw new Error('Clipboard API not available')
      }
    } catch (error) {
      // Fallback to text selection
      try {
        if (!commandRef.current) {
          throw new Error('Command element ref not attached')
        }

        const range = document.createRange()
        range.selectNodeContents(commandRef.current)

        const selection = window.getSelection()
        if (!selection) {
          throw new Error('Could not get window selection')
        }

        selection.removeAllRanges()
        selection.addRange(range)

        // Attempt legacy execCommand as last resort
        try {
          const success = document.execCommand('copy')
          if (success) {
            setStatus('success')
            onSuccess?.()
          } else {
            setStatus('error')
            onError?.(
              error instanceof Error
                ? error
                : new Error('Copy failed - please manually select and copy')
            )
          }
        } catch {
          // execCommand failed, but text is selected - consider it a partial success
          setStatus('error')
          onError?.(
            error instanceof Error
              ? error
              : new Error('Text selected - please copy manually')
          )
        }

        scheduleReset()
      } catch (fallbackError) {
        setStatus('error')
        onError?.(
          fallbackError instanceof Error
            ? fallbackError
            : new Error('Copy operation failed')
        )
        scheduleReset()
      }
    }
  }, [command, status, onSuccess, onError, scheduleReset])

  return {
    status,
    commandRef,
    copy,
    reset,
  }
}
