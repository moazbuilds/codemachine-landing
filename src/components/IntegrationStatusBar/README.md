# IntegrationStatusBar

**Status:** ✅ Complete (I2.T3)
**Dependencies:** `useGitHubStars` hook, `src/lib/github.ts`, `@/content/flags.ts`

---

## Overview

The `IntegrationStatusBar` component displays a live GitHub star count badge with intelligent caching, retry logic, and graceful fallbacks. It integrates with the GitHub REST API to fetch real-time telemetry while maintaining a non-blocking, performant user experience.

---

## Features

- ✅ **Live GitHub star fetching** via REST API v3
- ✅ **6-hour cache** (configurable) using localStorage
- ✅ **Retry logic** (max 2 attempts) with linear backoff
- ✅ **Fallback to "100+ Stars"** on error/rate limit
- ✅ **Non-blocking fetch** via `requestIdleCallback`
- ✅ **Accessibility** with `aria-live` announcements
- ✅ **Reduced motion** support for animations
- ✅ **Feature flag** controlled (`enableGithubStars`)

---

## Usage

### Basic Example

```tsx
import { IntegrationStatusBar } from '@/components/IntegrationStatusBar'

function App() {
  return (
    <div>
      <IntegrationStatusBar />
    </div>
  )
}
```

### Custom Repository

```tsx
<IntegrationStatusBar repo="facebook/react" />
```

### Custom Fallback Label

```tsx
<IntegrationStatusBar fallbackLabel="⭐ Popular Repository" />
```

### Custom Cache Duration

```tsx
<IntegrationStatusBar cacheHours={12} />
```

### Integration with NavigationBar

```tsx
// Example: Add to NavigationBar desktop links section
<div className="hidden md:flex items-center gap-6">
  {externalLinks.map((link) => (
    <a key={link.label} href={link.href}>
      {link.label}
    </a>
  ))}
  <IntegrationStatusBar />
</div>
```

---

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `repo` | `string` | `"moazbuilds/CodeMachine-CLI"` | GitHub repository in `owner/repo` format |
| `fallbackLabel` | `string` | `"100+ Stars"` | Text displayed on error or when feature disabled |
| `cacheHours` | `number` | `6` (env override supported) | Cache duration in hours before refresh |
| `className` | `string` | `""` | Additional CSS classes |

---

## Feature Flag Control

The component respects the `enableGithubStars` feature flag from `src/content/flags.ts`:

```typescript
// In src/content/flags.ts
{
  key: 'enableGithubStars',
  enabled: true  // Toggle to enable/disable live fetching
}
```

When disabled:
- No network requests are made
- Component displays `fallbackLabel` immediately
- No loading skeleton shown

---

## Related Files

- **Hook:** `src/hooks/useGitHubStars.ts` - Data fetching logic
- **API Client:** `src/lib/github.ts` - GitHub REST API integration
- **Types:** `src/content/types.ts` - StarMetric type definition
- **Content:** `src/content/links.ts` - Fallback helper function
- **Flags:** `src/content/flags.ts` - Feature flag configuration
- **API Docs:** `api/github_star_fetch.md` - Complete API contract

---

## Environment Variables

```bash
# Optional: GitHub personal access token for authenticated requests
VITE_GITHUB_TOKEN=ghp_your_token_here

# Optional: Override default 6h cache TTL (hours)
VITE_GITHUB_STARS_TTL_HOURS=6
```

**Benefits of authentication:**
- Unauthenticated: 60 requests/hour per IP
- Authenticated: 5,000 requests/hour per user

---

**Iteration:** I2.T3
**Agent:** BackendAgent
**Last Updated:** 2025-11-22
