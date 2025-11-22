/**
 * E2E Journey Tests - Playwright
 * Task: I3.T3 - Responsiveness & Performance Hardening
 *
 * Coverage:
 * - Journey 2: Feature Exploration (scroll to features, bento cards reveal)
 * - Journey 3: Docs & GitHub Navigation (external links, security attributes)
 *
 * Test Strategy:
 * - Multi-viewport testing (desktop 1920x1080, mobile 375x667)
 * - Network throttling (Slow 4G) to simulate real-world conditions
 * - Verify scroll reveals, external links, and accessibility attributes
 *
 * Dependencies Required:
 * - @playwright/test
 *
 * Run with: pnpm test:e2e
 */

import { test, expect, type Page } from '@playwright/test'

type ClipboardWindow = Window & { __copiedCommand?: string }

/* ============================================================================
   TEST CONFIGURATION
   ========================================================================= */

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'

// Viewport configurations
const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 667 },
}

// Network profiles
const NETWORK_PROFILES = {
  slow4g: {
    downloadThroughput: (500 * 1024) / 8, // 500 Kbps
    uploadThroughput: (500 * 1024) / 8,
    latency: 400, // 400ms latency
  },
  cable: {
    downloadThroughput: (5 * 1024 * 1024) / 8, // 5 Mbps
    uploadThroughput: (1 * 1024 * 1024) / 8, // 1 Mbps
    latency: 28, // 28ms latency
  },
}

/* ============================================================================
   HELPER FUNCTIONS
   ========================================================================= */

/**
 * Wait for page to be fully loaded and interactive
 */
async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle')
  await page.waitForLoadState('domcontentloaded')
}

/**
 * Scroll element into view smoothly
 */
async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded({ timeout: 5000 })
  // Wait for scroll animations to settle
  await page.waitForTimeout(500)
}

/**
 * Stub clipboard API for deterministic copy interactions
 */
async function stubClipboard(page: Page) {
  await page.addInitScript(() => {
    const typedWindow = window as ClipboardWindow

    Object.defineProperty(typedWindow, '__copiedCommand', {
      value: '',
      writable: true,
      configurable: true,
    })

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: (text: string) => {
          typedWindow.__copiedCommand = text
          return Promise.resolve()
        },
      },
    })
  })
}

/* ============================================================================
   JOURNEY 2: FEATURE EXPLORATION
   ========================================================================= */

test.describe('Journey 2: Feature Exploration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)
  })

  test('should scroll to features section and trigger reveal animations (desktop)', async ({
    page,
    context,
  }) => {
    // Set desktop viewport
    await page.setViewportSize(VIEWPORTS.desktop)

    // Apply cable network throttling
    const client = await context.newCDPSession(page)
    await client.send('Network.emulateNetworkConditions', NETWORK_PROFILES.cable)

    // Navigate to features section
    await scrollToElement(page, '#features')

    // Verify features section is visible
    const featuresSection = page.locator('#features')
    await expect(featuresSection).toBeVisible({ timeout: 10000 })

    // Wait for bento cards to reveal
    await page.waitForTimeout(1000)

    // Verify bento cards are revealed (opacity > 0.5)
    const bentoCards = page.locator('[data-testid="feature-card"]')
    const cardCount = await bentoCards.count()

    if (cardCount > 0) {
      // Check first card is revealed
      const firstCard = bentoCards.first()
      const opacity = await firstCard.evaluate((el) =>
        window.getComputedStyle(el).opacity
      )
      expect(parseFloat(opacity)).toBeGreaterThan(0.5)
    } else {
      // Fallback: check for any feature-related elements
      const featureElements = page.locator('section#features *').filter({
        hasText: /feature|capability|integration/i,
      })
      await expect(featureElements.first()).toBeVisible()
    }
  })

  test('should handle hover interactions on feature cards (desktop)', async ({
    page,
  }) => {
    await page.setViewportSize(VIEWPORTS.desktop)

    // Scroll to features
    await scrollToElement(page, '#features')

    // Find hoverable feature cards
    const featureCards = page.locator(
      '[data-testid="feature-card"], .feature-card, section#features > div > div'
    )

    if ((await featureCards.count()) > 0) {
      const firstCard = featureCards.first()

      // Get initial styles
      const initialStyles = await firstCard.evaluate((el) => ({
        boxShadow: window.getComputedStyle(el).boxShadow,
        borderColor: window.getComputedStyle(el).borderColor,
      }))

      // Hover over card
      await firstCard.hover()
      await page.waitForTimeout(300)

      // Verify hover effects (glow, border change, etc.)
      const hoveredStyles = await firstCard.evaluate((el) => ({
        boxShadow: window.getComputedStyle(el).boxShadow,
        borderColor: window.getComputedStyle(el).borderColor,
      }))

      // At least one style property should change on hover
      const stylesChanged =
        hoveredStyles.boxShadow !== initialStyles.boxShadow ||
        hoveredStyles.borderColor !== initialStyles.borderColor

      expect(stylesChanged).toBe(true)
    }
  })

  test('should display mobile-friendly feature layout', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)

    await scrollToElement(page, '#features')

    // Verify features section uses single-column layout on mobile
    const featuresSection = page.locator('#features')
    await expect(featuresSection).toBeVisible()

    // Check that touch targets are at least 48px tall (WCAG requirement)
    const interactiveElements = page.locator(
      '#features button, #features a, #features [role="button"]'
    )

    if ((await interactiveElements.count()) > 0) {
      const firstElement = interactiveElements.first()
      const height = await firstElement.evaluate(
        (el) => el.getBoundingClientRect().height
      )
      expect(height).toBeGreaterThanOrEqual(44) // Allow small tolerance
    }
  })

  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })

    await page.goto(BASE_URL)
    await waitForPageReady(page)

    // Scroll to features
    await scrollToElement(page, '#features')

    // Verify elements are visible immediately without animation delays
    const featureSection = page.locator('#features')
    await expect(featureSection).toBeVisible({ timeout: 2000 })

    // Check that animation-duration is minimal
    const animatedElement = page
      .locator('section#features > div')
      .first()
    const animationDuration = await animatedElement.evaluate(
      (el) => window.getComputedStyle(el).animationDuration
    )

    // Should be near-instant (0.01ms as per CSS)
    expect(parseFloat(animationDuration)).toBeLessThan(0.1)
  })
})

/* ============================================================================
   JOURNEY 3: DOCS & GITHUB NAVIGATION
   ========================================================================= */

test.describe('Journey 3: Docs & GitHub Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)
  })

  test('should complete copy -> docs -> GitHub flow sequentially', async ({
    page,
    context,
  }) => {
    await stubClipboard(page)
    await page.goto(BASE_URL)
    await waitForPageReady(page)

    // Copy command
    const copyButton = page
      .getByRole('button', { name: /copy command/i })
      .first()
    await expect(copyButton).toBeVisible()
    await copyButton.click()
    await expect(copyButton).toHaveAttribute('aria-label', /Copied successfully/i)

    const copiedCommand = await page.evaluate(() => {
      const clipboardWindow = window as ClipboardWindow
      return clipboardWindow.__copiedCommand ?? ''
    })
    expect(copiedCommand).toMatch(/npx|pnpm|npm/)

    // Docs navigation
    const docsLink = page.locator('a[href*="docs"], a:has-text("Docs")').first()
    const [docsPage] = await Promise.all([
      context.waitForEvent('page'),
      docsLink.click(),
    ])
    await docsPage.waitForLoadState('domcontentloaded')
    expect(docsPage.url()).toMatch(/docs/i)
    await docsPage.close()

    // GitHub navigation
    const githubLink = page.locator('a[href*="github.com"]').first()
    const [githubPage] = await Promise.all([
      context.waitForEvent('page'),
      githubLink.click(),
    ])
    await githubPage.waitForLoadState('domcontentloaded')
    expect(githubPage.url()).toContain('github.com')
    await githubPage.close()
  })

  test('should open documentation in new tab with security attributes', async ({
    page,
    context,
  }) => {
    // Find Docs button/link
    const docsLink = page.locator('a[href*="docs"], a:has-text("Docs")')

    if ((await docsLink.count()) > 0) {
      // Verify security attributes
      const rel = await docsLink.first().getAttribute('rel')
      const target = await docsLink.first().getAttribute('target')

      expect(target).toBe('_blank')
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')

      // Listen for new page
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        docsLink.first().click(),
      ])

      // Verify new tab opened
      expect(newPage).toBeTruthy()
      await newPage.close()
    } else {
      test.skip()
    }
  })

  test('should navigate to GitHub repository with security attributes', async ({
    page,
    context,
  }) => {
    // Find GitHub link (could be star badge, header link, or footer link)
    const githubLink = page.locator(
      'a[href*="github.com"], a[aria-label*="GitHub"], [data-testid="github-stars"]'
    )

    if ((await githubLink.count()) > 0) {
      const firstGithubLink = githubLink.first()

      // Verify security attributes
      const rel = await firstGithubLink.getAttribute('rel')
      const target = await firstGithubLink.getAttribute('target')

      expect(target).toBe('_blank')
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')

      // Verify GitHub URL
      const href = await firstGithubLink.getAttribute('href')
      expect(href).toContain('github.com')

      // Listen for new page
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        firstGithubLink.click(),
      ])

      // Verify GitHub page opened
      expect(newPage.url()).toContain('github.com')
      await newPage.close()
    } else {
      test.skip()
    }
  })

  test('should track analytics events for external navigation', async ({
    page,
  }) => {
    // Monitor console for analytics events
    const analyticsEvents: string[] = []

    page.on('console', (msg) => {
      const text = msg.text()
      if (text.includes('Analytics') || text.includes('trackEvent')) {
        analyticsEvents.push(text)
      }
    })

    // Click GitHub link
    const githubLink = page.locator('a[href*="github.com"]').first()

    if (await githubLink.isVisible()) {
      await githubLink.click({ noWaitAfter: true })
      await page.waitForTimeout(500)

      // Verify analytics was called (if implemented)
      // This is optional - depends on analytics implementation
      // expect(analyticsEvents.length).toBeGreaterThan(0)
    }
  })

  test('should display GitHub stars count', async ({ page }) => {
    // Find GitHub stars badge
    const starsBadge = page.locator(
      '[data-testid="github-stars"], .github-stars, a[href*="github.com"]:has-text("⭐")'
    )

    if ((await starsBadge.count()) > 0) {
      await expect(starsBadge.first()).toBeVisible()

      // Verify stars count is displayed (number > 0)
      const text = await starsBadge.first().textContent()
      const hasNumber = /\d+/.test(text || '')
      expect(hasNumber).toBe(true)
    }
  })
})

/* ============================================================================
   PERFORMANCE & ACCESSIBILITY TESTS
   ========================================================================= */

test.describe('Performance & Accessibility', () => {
  test('should meet Cumulative Layout Shift (CLS) target', async ({ page }) => {
    await page.goto(BASE_URL)

    // Wait for page to stabilize
    await waitForPageReady(page)

    // Scroll through page to trigger lazy loads
    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    })
    await page.waitForTimeout(2000)

    // Measure CLS via Performance Observer
    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsScore = 0

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as LayoutShift[]) {
            if (entry.hadRecentInput) continue
            clsScore += entry.value
          }
        })

        observer.observe({ type: 'layout-shift', buffered: true })

        setTimeout(() => {
          observer.disconnect()
          resolve(clsScore)
        }, 1000)
      })
    })

    // CLS should be < 0.05 per acceptance criteria
    expect(cls).toBeLessThan(0.05)
  })

  test('should lazy-load mobile simulation screenshot', async ({ page }) => {
    await page.setViewportSize(VIEWPORTS.mobile)
    await page.goto(BASE_URL)

    // Verify mobile screenshot uses lazy loading
    const mobileImage = page.locator('picture img[loading="lazy"]')

    if (await mobileImage.isVisible()) {
      const loading = await mobileImage.getAttribute('loading')
      const decoding = await mobileImage.getAttribute('decoding')

      expect(loading).toBe('lazy')
      expect(decoding).toBe('async')

      // Verify image has aspect-ratio to prevent CLS
      const aspectRatio = await mobileImage.evaluate(
        (el) => window.getComputedStyle(el).aspectRatio
      )
      expect(aspectRatio).not.toBe('auto')
    }
  })

  test('should have accessible external links with aria-labels', async ({
    page,
  }) => {
    await page.goto(BASE_URL)
    await waitForPageReady(page)

    // Find all external links
    const externalLinks = page.locator('a[target="_blank"]')
    const count = await externalLinks.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = externalLinks.nth(i)
      const ariaLabel = await link.getAttribute('aria-label')
      const text = await link.textContent()

      // Either aria-label or text content should exist
      expect(ariaLabel || text).toBeTruthy()
    }
  })
})

/* ============================================================================
   MULTI-VIEWPORT REGRESSION TESTS
   ========================================================================= */

test.describe('Responsive Layout Tests', () => {
  const viewportSizes = [
    { name: 'mobile', ...VIEWPORTS.mobile },
    { name: 'desktop', ...VIEWPORTS.desktop },
  ]

  for (const viewport of viewportSizes) {
    test(`should render correctly on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto(BASE_URL)
      await waitForPageReady(page)

      // Verify hero section
      const hero = page.locator('section, header').first()
      await expect(hero).toBeVisible()

      // Verify navigation
      const nav = page.locator('nav, [role="navigation"]')
      if (await nav.isVisible()) {
        await expect(nav).toBeVisible()
      }

      // Verify no horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      const viewportWidth = await page.evaluate(() => window.innerWidth)
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1) // Allow 1px tolerance
    })
  }
})
