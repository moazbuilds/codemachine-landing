/**
 * CopyButton Component
 * Task: I2.T1 - HeroCommandPanel Implementation
 *
 * Icon-based copy button with state machine visualization.
 * Transitions through idle → copying → success/error states with
 * appropriate icons and ARIA feedback.
 *
 * Acceptance Criteria:
 * - Displays appropriate icon for each state (clipboard → loader → check/alert)
 * - Provides aria-live announcements for screen readers
 * - Maintains focus-visible styles for keyboard navigation
 * - Disables during copying state to prevent double-clicks
 */

import { useEffect, useState } from 'react'
import { Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  /**
   * Current clipboard operation status
   */
  status: 'idle' | 'copying' | 'success' | 'error'

  /**
   * Callback triggered when button is clicked
   */
  onClick: () => void

  /**
   * Optional additional CSS classes
   */
  className?: string

  /**
   * Whether the button should be disabled (independent of status)
   */
  disabled?: boolean
}

/**
 * CopyButton - Stateful icon button for clipboard operations
 *
 * Icon states:
 * - idle: Copy icon (clipboard)
 * - copying: Loader2 (animated spinner)
 * - success: Check icon (checkmark)
 * - error: AlertCircle (warning)
 *
 * @example
 * ```tsx
 * <CopyButton
 *   status={clipboardStatus}
 *   onClick={handleCopy}
 * />
 * ```
 */
export function CopyButton({
  status,
  onClick,
  className,
  disabled = false,
}: CopyButtonProps) {
  const [announcement, setAnnouncement] = useState('')

  // Update ARIA live region when status changes
  useEffect(() => {
    switch (status) {
      case 'copying':
        setAnnouncement('Copying command to clipboard...')
        break
      case 'success':
        setAnnouncement('Command copied to clipboard successfully!')
        break
      case 'error':
        setAnnouncement(
          'Could not copy automatically. Please select and copy the command manually.'
        )
        break
      default:
        setAnnouncement('')
    }
  }, [status])

  // Determine which icon to render
  const IconComponent = {
    idle: Copy,
    copying: Loader2,
    success: Check,
    error: AlertCircle,
  }[status]

  // Button is disabled if status is 'copying' or explicitly disabled
  const isDisabled = disabled || status === 'copying'

  // Dynamic styling based on status
  const buttonStyles = cn(
    // Base styles
    'relative flex items-center justify-center',
    'h-10 w-10 rounded-lg',
    'transition-all duration-200',
    'focus-ring-aura',

    // State-specific colors
    status === 'idle' &&
      'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white',
    status === 'copying' && 'bg-primary-500/20 border border-primary-500/30 text-primary-400',
    status === 'success' && 'bg-emerald-400/20 border border-emerald-400/30 text-emerald-400',
    status === 'error' && 'bg-error-500/20 border border-error-500/30 text-error-500',

    // Disabled state
    isDisabled && 'cursor-not-allowed opacity-60',

    // Custom classes
    className
  )

  const iconStyles = cn(
    'h-5 w-5',
    // Animate spinner during copying
    status === 'copying' && 'animate-spin'
  )

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        className={buttonStyles}
        aria-label={
          status === 'idle'
            ? 'Copy command to clipboard'
            : status === 'copying'
              ? 'Copying...'
              : status === 'success'
                ? 'Copied successfully'
                : 'Copy failed'
        }
        aria-live="polite"
        aria-atomic="true"
      >
        <IconComponent className={iconStyles} aria-hidden="true" />
      </button>

      {/* Hidden live region for screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </>
  )
}
