# Design Brief

**Purpose:** Transparent AI-powered resume matching for candidates and job creation for admins. Build trust through clear data visualization and fair, visible scoring.

**Tone:** Professional, refined, trustworthy — every pixel serves the matching logic. Clean, credible SaaS recruiting.

**Differentiation:** Scored transparency + side-by-side job comparison creates emotional core. Candidate dashboard emphasizes fairness through ranked match percentages.

## Color Palette

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| Primary | `0.55 0.14 240` (professional blue) | `0.72 0.15 250` | Trust, actions, primary CTA |
| Accent | `0.63 0.15 146` (emerald green) | `0.75 0.18 140` | Match success, confidence, highlight |
| Secondary | `0.92 0.04 230` (soft slate) | `0.25 0.08 240` | Calm, context, secondary actions |
| Destructive | `0.55 0.22 25` (warm red) | `0.65 0.19 22` | Rejection, warning, destructive |
| Neutral | `0.98 0.01 260` → `0.18 0.02 260` | `0.13 0.01 260` → `0.92 0.02 260` | Backgrounds, text, grids |

## Typography

| Layer | Font | Weight | Usage |
|-------|------|--------|-------|
| Display | Space Grotesk | 700 | Headings, hero, emphasis |
| Body | Plus Jakarta Sans | 400–700 | Copy, labels, form text |
| Mono | JetBrains Mono | 400–700 | Match percentages, scores, codes |

**Type Scale:** 12px → 14px (body) → 16px → 18px → 24px (display).

## Elevation & Depth

- **Card base:** White (`--card`) with subtle `shadow-subtle` for clean hierarchy.
- **Match cards:** `shadow-md` + `border-border` 1px + emerald accent bar (top, 4px height).
- **Admin forms:** Light input background (`--input`), focused ring in primary blue.
- **Header:** Branded blue background with white text; minimal shadow depth.

## Structural Zones

| Zone | Treatment | Intent |
|------|-----------|--------|
| Header/Nav | `bg-primary` with white text, `border-b border-border` | Branded authority |
| Match Cards | `bg-card` elevated, `border-border`, accent bar + score badge | Visual scanning, trust |
| Admin Panel | `bg-secondary/40` form sections with `form-input` styling | Clean input hierarchy |
| Footer | `bg-background` with `border-t border-border` only | Minimal, grounded |

## Shape Language

- **Radius:** `rounded-md` (8px) default; `rounded-lg` (8px) for cards; `rounded-full` for score badges.
- **Borders:** 1px `--border` on interactive elements; no double borders.
- **Spacing density:** Generous padding (1rem) for readability; 0.75rem gutters for compact grids.

## Component Patterns

- **Match score badge:** Circular, `score-badge` utility (Accent bg, white text, 3rem).
- **Match card:** Elevated, bordered, accent bar, job title + company + match reason.
- **Form inputs:** `form-input` utility with consistent focus ring (primary blue).
- **Button hierarchy:** Primary (blue bg) → Secondary (slate bg) → Tertiary (text-only).

## Motion & Micro-interactions

- **Entrance:** `animate-slide-up` for match cards (0.3s cubic-bezier).
- **Hover:** `scale-105` on cards + `shadow-elevated` transition-smooth.
- **Focus:** Primary ring on inputs, outline-offset 2px.

## Anti-patterns Avoided

- No warm/cold bias in neutrals — cool slate throughout.
- No purple or gradient overlays — trust through clarity.
- No overly rounded corners — 8px maintains professionalism.
- No rainbow charts — 5 intentional colors (accent, primary, secondary, warning, destructive).

## Signature Detail

Emerald accent bar on match cards creates a scanning shortcut — candidates instantly recognize matched jobs by color + percentage. This visual language extends to all success states.
