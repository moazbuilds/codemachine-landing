/**
 * Unit Tests for Custom Hooks
 * Task: I3.T3 - Responsiveness & Performance Hardening
 *
 * Tests coverage:
 * - useScrollReveal: Early reveal behavior, reduced-motion handling
 * - useClipboardCommand: Clipboard API, fallback selection, reduced-motion
 *
 * Testing Strategy:
 * - Mock browser APIs (IntersectionObserver, Clipboard, matchMedia)
 * - Assert deterministic results for all edge cases
 * - Verify accessibility constraints (reduced-motion short-circuits)
 *
 * Dependencies Required:
 * - vitest
 * - @testing-library/react
 * - @testing-library/react-hooks
 *
 * Run with: pnpm test:unit
 */

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useClipboardCommand } from '@/hooks/useClipboardCommand'
import {
  ScrollRevealProvider,
  useScrollRevealContext,
  type ScrollRevealContextValue,
} from '@/context/ScrollRevealProvider'
import {
  createRef,
  useEffect,
  type ReactNode,
  type MutableRefObject,
  type RefObject,
} from 'react'

/* ============================================================================
   MOCKS & TEST UTILITIES
   ========================================================================= */

/**
 * Mock IntersectionObserver
 * Provides controlled visibility simulation for scroll reveal tests
 */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = '0px'
  readonly thresholds: ReadonlyArray<number> = [0]

  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])

  // Helper to trigger intersection callback
  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(
      entries as IntersectionObserverEntry[],
      this as IntersectionObserver
    )
  }
}

/**
 * Mock window.matchMedia for reduced-motion tests
 */
function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? matches : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

/**
 * Mock navigator.clipboard for clipboard tests
 */
function mockClipboard(writeTextImpl?: () => Promise<void>) {
  Object.defineProperty(navigator, 'clipboard', {
    writable: true,
    value: {
      writeText: vi.fn(
        writeTextImpl || (() => Promise.resolve())
      ),
    },
  })
}

/**
 * Mock document.execCommand for legacy fallback tests
 */
function mockExecCommand(returnValue: boolean) {
  document.execCommand = vi.fn(() => returnValue)
}

/**
 * Context bridge to expose ScrollReveal context for tests
 */
function ScrollRevealContextBridge({
  children,
  onReady,
}: {
  children: ReactNode
  onReady?: (ctx: ScrollRevealContextValue) => void
}) {
  const context = useScrollRevealContext()

  useEffect(() => {
    onReady?.(context)
  }, [context, onReady])

  return <>{children}</>
}

const createScrollRevealWrapper = (
  onReady?: (ctx: ScrollRevealContextValue) => void
) => {
  return ({ children }: { children: ReactNode }) => (
    <ScrollRevealProvider>
      <ScrollRevealContextBridge onReady={onReady}>
        {children}
      </ScrollRevealContextBridge>
    </ScrollRevealProvider>
  )
}

const getLatestObserverInstance = () => {
  const results = (IntersectionObserver as unknown as Mock).mock.results
  return results[results.length - 1]?.value
}

const createElementRef = <T extends HTMLElement>(element: T): RefObject<T> =>
  ({
    current: element,
  }) as RefObject<T>

/* ============================================================================
   useScrollReveal TESTS
   ========================================================================= */

describe('useScrollReveal', () => {
  beforeEach(() => {
    // Setup IntersectionObserver mock
    global.IntersectionObserver = vi
      .fn()
      .mockImplementation(
        (callback, options) => new MockIntersectionObserver(callback, options)
      ) as unknown as typeof IntersectionObserver

    // Setup matchMedia for normal motion
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return false initially before element is visible', () => {
    const elementRef = createRef<HTMLDivElement>()

    const { result } = renderHook(() => useScrollReveal(elementRef), {
      wrapper: createScrollRevealWrapper(),
    })

    expect(result.current).toBe(false)
  })

  it('should return true when element becomes visible', async () => {
    const mockElement = document.createElement('div')
    const elementRef = createElementRef(mockElement)

    const { result } = renderHook(() => useScrollReveal(elementRef), {
      wrapper: createScrollRevealWrapper(),
    })

    // Simulate intersection observer trigger
    const observerInstance = getLatestObserverInstance()
    await act(async () => {
      observerInstance?.trigger([
        {
          target: mockElement,
          isIntersecting: true,
          intersectionRatio: 0.5,
        },
      ])
    })

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should support manual trigger via triggerReveal helper', async () => {
    const mockElement = document.createElement('div')
    const elementRef = createElementRef(mockElement)

    let capturedContext: ScrollRevealContextValue | null = null

    const wrapper = createScrollRevealWrapper((ctx) => {
      capturedContext = ctx
    })

    const { result } = renderHook(() => useScrollReveal(elementRef), {
      wrapper,
    })

    expect(result.current).toBe(false)

    await waitFor(() => {
      expect(capturedContext).toBeTruthy()
    })

    await act(async () => {
      capturedContext?.triggerReveal?.(mockElement)
    })

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should immediately return true when reduced-motion is enabled', () => {
    // Enable reduced motion
    mockMatchMedia(true)

    const mockElement = document.createElement('div')
    const elementRef = createElementRef(mockElement)

    const { result } = renderHook(() => useScrollReveal(elementRef), {
      wrapper: createScrollRevealWrapper(),
    })

    // Should be true immediately without observer trigger
    expect(result.current).toBe(true)
  })

  it('should unregister element when requested', async () => {
    const mockElement = document.createElement('div')
    const elementRef = createElementRef(mockElement)

    let capturedContext: ScrollRevealContextValue | null = null
    const { unmount } = renderHook(() => useScrollReveal(elementRef), {
      wrapper: createScrollRevealWrapper((ctx) => {
        capturedContext = ctx
      }),
    })

    await waitFor(() => {
      expect(getLatestObserverInstance()).toBeTruthy()
      expect(capturedContext).toBeTruthy()
    })

    const observerInstance = getLatestObserverInstance()

    await act(async () => {
      capturedContext?.unregister(mockElement)
    })

    expect(observerInstance?.unobserve).toHaveBeenCalledWith(mockElement)
    unmount()
  })
})

/* ============================================================================
   useClipboardCommand TESTS
   ========================================================================= */

describe('useClipboardCommand', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    vi.clearAllMocks()
    mockMatchMedia(false)
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      writable: true,
      value: 'visible',
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should copy to clipboard using Clipboard API', async () => {
    const mockWriteText = vi.fn(() => Promise.resolve())
    mockClipboard(mockWriteText)

    const onSuccess = vi.fn()
    const command = 'npm install codemachine'

    const { result } = renderHook(() =>
      useClipboardCommand({ command, onSuccess })
    )

    await act(async () => {
      await result.current.copy()
    })

    expect(mockWriteText).toHaveBeenCalledWith(command)
    expect(result.current.status).toBe('success')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('should fallback to execCommand when Clipboard API fails', async () => {
    // Simulate Clipboard API failure
    const mockWriteText = vi.fn(() => Promise.reject(new Error('Permission denied')))
    mockClipboard(mockWriteText)
    mockExecCommand(true)

    const onSuccess = vi.fn()
    const command = 'npm install codemachine'

    const mockElement = document.createElement('code')
    mockElement.textContent = command
    document.body.appendChild(mockElement)

    const { result } = renderHook(() =>
      useClipboardCommand({ command, onSuccess })
    )

    // Attach ref
    const commandRef =
      result.current.commandRef as MutableRefObject<HTMLElement | null>
    commandRef.current = mockElement

    await act(async () => {
      await result.current.copy()
    })

    expect(document.execCommand).toHaveBeenCalledWith('copy')
    expect(result.current.status).toBe('success')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('should handle complete clipboard failure gracefully', async () => {
    // Simulate both API and execCommand failure
    const mockWriteText = vi.fn(() => Promise.reject(new Error('Permission denied')))
    mockClipboard(mockWriteText)
    mockExecCommand(false)

    const onError = vi.fn()
    const command = 'npm install codemachine'

    const mockElement = document.createElement('code')
    mockElement.textContent = command
    document.body.appendChild(mockElement)

    const { result } = renderHook(() =>
      useClipboardCommand({ command, onError })
    )

    const commandRef =
      result.current.commandRef as MutableRefObject<HTMLElement | null>
    commandRef.current = mockElement

    await act(async () => {
      await result.current.copy()
    })

    expect(result.current.status).toBe('error')
    expect(onError).toHaveBeenCalled()
  })

  it('should auto-reset status after timeout', async () => {
    vi.useFakeTimers()

    const mockWriteText = vi.fn(() => Promise.resolve())
    mockClipboard(mockWriteText)

    const command = 'npm install codemachine'
    const resetTimeout = 2000

    const { result } = renderHook(() =>
      useClipboardCommand({ command, resetTimeout })
    )

    await act(async () => {
      await result.current.copy()
    })

    expect(result.current.status).toBe('success')

    // Fast-forward past reset timeout
    await act(async () => {
      vi.advanceTimersByTime(resetTimeout + 100)
    })

    expect(result.current.status).toBe('idle')

    vi.useRealTimers()
  })

  it('should not copy when document is hidden', async () => {
    const mockWriteText = vi.fn(() => Promise.resolve())
    mockClipboard(mockWriteText)

    // Mock document visibility
    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: 'hidden',
    })

    const command = 'npm install codemachine'
    const { result } = renderHook(() => useClipboardCommand({ command }))

    await act(async () => {
      await result.current.copy()
    })

    expect(mockWriteText).not.toHaveBeenCalled()
    expect(result.current.status).toBe('idle')
  })

  it('should not trigger copy while already copying', async () => {
    const mockWriteText = vi.fn(
      () =>
        new Promise((resolve) => setTimeout(resolve, 1000))
    )
    mockClipboard(mockWriteText)

    const command = 'npm install codemachine'
    const { result } = renderHook(() => useClipboardCommand({ command }))

    // First copy starts
    act(() => {
      void result.current.copy()
    })

    await waitFor(() => {
      expect(result.current.status).toBe('copying')
    })

    // Second copy should be ignored
    result.current.copy()

    expect(mockWriteText).toHaveBeenCalledTimes(1)
  })

  it('should manually reset status', async () => {
    const mockWriteText = vi.fn(() => Promise.resolve())
    mockClipboard(mockWriteText)

    const command = 'npm install codemachine'
    const { result } = renderHook(() => useClipboardCommand({ command }))

    await act(async () => {
      await result.current.copy()
    })

    expect(result.current.status).toBe('success')

    await act(async () => {
      result.current.reset()
    })

    expect(result.current.status).toBe('idle')
  })
})

/* ============================================================================
   INTEGRATION TESTS
   ========================================================================= */

describe('Hooks Integration', () => {
  it('should respect reduced-motion for both hooks', async () => {
    mockMatchMedia(true)
    mockClipboard()

    const mockElement = document.createElement('div')
    const elementRef = createElementRef(mockElement)

    // Test useScrollReveal with reduced motion
    const { result: scrollResult } = renderHook(
      () => useScrollReveal(elementRef),
      {
        wrapper: createScrollRevealWrapper(),
      }
    )

    expect(scrollResult.current).toBe(true) // Immediately visible

    // Test useClipboardCommand still works
    const { result: clipboardResult } = renderHook(() =>
      useClipboardCommand({ command: 'test' })
    )

    await act(async () => {
      await clipboardResult.current.copy()
    })

    expect(clipboardResult.current.status).toBe('success')
  })
})
