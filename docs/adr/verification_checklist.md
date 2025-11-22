<!-- anchor: verification-checklist -->
# Deployment & Verification Checklist

Codifies the release gates for CodeMachine Landing so every change leaving `main` carries the same level of scrutiny. Revisit this document during iteration reviews and update owners when roles shift.

## Gate Matrix

| Gate | Primary Owner | Tool / Command | Cadence | Pass Criteria |
| --- | --- | --- | --- | --- |
| Static analysis | Frontend lead | `pnpm run lint` (ESLint a11y + TS rules) | Every pull request | All files lint clean, zero warnings (CI enforces `--max-warnings 0`). |
| Unit tests | Feature engineer | `pnpm run test:unit` (Vitest) | Every pull request + nightly cron | Hooks/lib specs green with ≥80% statement coverage. |
| End-to-end journeys | QA engineer | `pnpm run test:e2e` (Playwright) | Every pull request targeting `main`; smoke cron every 6 hours | `tests/e2e/journey.spec.ts` passes desktop + mobile flows without retries; attaches trace on failure. |
| Lighthouse budgets | Perf advocate | `pnpm run test:perf` (`pnpm exec lhci autorun`) | Every push to `main` + weekly scheduled run | Performance ≥90, Accessibility ≥95, Best Practices ≥95, SEO ≥90; budgets met. |
| Build & type-check | Release engineer | `pnpm run build` | Every workflow run | Vite build succeeds, bundle guard <200KB gz, no TS errors. |
| Docker parity | Ops | `docker build -f Dockerfile .` (optional job) | Before each production deploy | Image build succeeds using node:20-alpine stages. |
| Deploy smoke | Ops | `vercel deploy --prebuilt --prod` or `netlify deploy --prod` | On tagged release | Deployment finishes, preview smoke uses Lighthouse + Playwright spot checks. |

## Runbook

1. **Checkout clean state:** `git fetch origin && git checkout main && git pull`.
2. **Install deps:** `pnpm install --frozen-lockfile` (CI uses pnpm cache via `PNPM_STORE_PATH`).
3. **Execute gates in matrix order** so fast feedback (lint/unit) prevents expensive Lighthouse reruns.
4. **Capture evidence:** Commit LHCI HTML and Playwright trace artifacts to workflow run; link to run in release notes.
5. **Validate hosting configs:** Dry-run via `vercel pull && vercel build` or `netlify deploy --build --dry-run` to ensure env vars are wired.
6. **Record outcomes:** Update this ADR with date/owner if exceptional steps performed (e.g., emergency skip approved).

## Release Sign-off

- [ ] **Frontend Lead:** Confirms UI polish, lint/unit coverage, and FeatureBentoGrid responsive audits.
- [ ] **QA Engineer:** Reviews latest Playwright + Lighthouse artifacts (attach run URLs).
- [ ] **Ops Lead:** Confirms platform deploy (Vercel primary, Netlify fallback) and incident playbook readiness.
- [ ] **Product/Stakeholder:** Approves copy + telemetry accuracy, acknowledges monitoring plan.

> Use GitHub checks as the system of record. Manual sign-off occurs in release PR description referencing this checklist anchor.

## Incident & Rerun Guidance

- **Flaky Playwright spec:** Re-run with `CI=1 pnpm run test:e2e --project=chromium --repeat-each=2`. Capture trace/screenshot for triage.
- **Lighthouse variance:** Retry with the same commit SHA inside a Vercel preview to rule out throttling noise. If still failing, document metrics in `TASK_COMPLETION.md`.
- **Workflow failure debug:** Use [`act`](https://github.com/nektos/act) locally with `act pull_request -j quality` to reproduce using Docker.
- **Monitoring alerts:** If Checkly/Pingdom fire twice consecutively, pause deploys and toggle fallback flags described in README troubleshooting.

## Maintenance Cadence

- **Weekly:** Perf advocate runs bundlesize + source-map explorer, logs deltas in this ADR.
- **Monthly:** Ops lead validates rollback steps (`vercel logs`, `vercel rollback`), refreshes GitHub tokens and Netlify build hooks.
- **Per release:** Update README deployment sections and ensure env variables match hosting provider dashboards.
