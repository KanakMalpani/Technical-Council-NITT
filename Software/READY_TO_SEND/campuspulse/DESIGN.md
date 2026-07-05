# CampusPulse Design System

Generated with **UI UX Pro Max** (Bento Grid + Flat SaaS) and motion principles inspired by **HyperFrames** frame-reveal timing.

## Visual Direction

CampusPulse should feel like a modern civic-tech product students would actually open daily: confident dark hero, crisp white workspace, green progress accents, and cinematic but restrained motion.

## Pattern

- Hero bento grid for impact metrics and spotlight issue
- Pipeline runway for operational transparency
- Three-panel workspace for intake, tracker, and detail

## Colors

| Token | Value | Use |
|---|---|---|
| `--bg-deep` | `#0b1220` | Hero background |
| `--primary` | `#22c55e` | Progress, CTAs, resolved states |
| `--accent` | `#38bdf8` | Secondary emphasis, 3D scene |
| `--ink` | `#0f172a` | Primary text |
| `--muted` | `#64748b` | Secondary text |

## Typography

**Plus Jakarta Sans** — friendly SaaS dashboard tone with strong numeric hierarchy.

## Motion (HyperFrames-inspired)

- Frame-rise entrance: `cubic-bezier(0.16, 1, 0.3, 1)` with staggered delays
- Ambient orb drift for depth without distraction
- Metric count-up on data refresh
- `prefers-reduced-motion` respected globally

## Product Rules

- Dashboard-first: tracker remains one scroll away from hero
- SVG icons only (Heroicons-style strokes)
- Visible focus rings and keyboard selection preserved
- No external UI dependencies beyond Google Fonts
