# Mobile Simulation Screenshot Required

**Task:** I3.T3 - Performance Hardening
**File:** `public/mobile-sim.webp`
**Target Size:** <35KB (WebP format)
**Status:** ✅ Generated via `python tools/generate_mobile_sim.py`

## Requirements

Generate an optimized mobile fallback screenshot from the VisualSimulationWindow component to display on mobile devices (<768px) where the full desktop simulation is hidden for performance reasons.

## Generation Steps

1. **Capture Source:**
   - Open the landing page in desktop mode (1920x1080)
   - Scroll to the VisualSimulationWindow section
   - Take a full screenshot of the simulation window (terminal panes + metrics)

2. **Optimize (scripted):**
   ```bash
   # Requires Pillow (install in .venv)
   .venv/bin/python tools/generate_mobile_sim.py

   # Verify size is <35KB
   stat -c '%n %s bytes' public/mobile-sim.*
   ```

3. **Placement:**
   - Move optimized file to `public/mobile-sim.webp`
   - Verify with: `ls -lh public/mobile-sim.webp`

## Image Specifications

- **Format:** WebP (with JPEG fallback in code)
- **Dimensions:** ~750px width (will be displayed at 375px on 2x devices)
- **Quality:** 70% (balanced quality/size)
- **Compression:** Level 6 (higher compression)
- **Alt Text:** "CodeMachine simulation window showing installation, telemetry, and performance metrics"

## Integration

The component will use this screenshot via:
```tsx
<picture className="md:hidden">
  <source type="image/webp" srcSet="/mobile-sim.webp" />
  <img
    src="/mobile-sim.jpg"
    alt="CodeMachine simulation window showing installation, telemetry, and performance metrics"
    loading="lazy"
    decoding="async"
    className="w-full rounded-2xl"
  />
</picture>
```

## Acceptance Criteria

- [x] File size ≤35KB
- [x] WebP format with JPEG fallback
- [x] Displays full simulation content clearly
- [x] Aspect ratio preserves original design
- [x] Descriptive alt text for accessibility
