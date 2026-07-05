# CampusPulse

CampusPulse is a Campus Development Initiative for NIT Trichy that turns everyday campus problems into visible, trackable student-led improvements.

It is now built as a small but complete operations dashboard: students can report campus issues, vote on priorities, filter/search the tracker, export reports, and follow a timeline from report to resolution.

## Problem

Campus issues often move through informal channels: WhatsApp groups, corridor conversations, and one-off complaints. That makes it hard for student bodies to identify what matters most, which locations are repeatedly affected, and whether progress is visible.

## Solution

CampusPulse gives Technical Council a focused student-facing tracker:

- Students raise campus signals with category, location, description, and optional contact.
- The tracker calculates a priority score using votes, age, and status.
- Volunteers can update status and add progress notes.
- Students can see a transparent timeline for each signal.
- Reports can be searched, filtered, sorted, and exported as CSV.

## Feature Highlights

- Operational dashboard first screen, not a marketing landing page.
- Local Three.js animated campus signal field with pointer-reactive motion.
- Responsive three-panel layout: intake, tracker, and detail/timeline.
- Priority scoring for issue triage.
- Signal runway showing each report moving from `Reported` to `Resolved`.
- Category heat pills for quick campus issue clustering.
- Contextual next-best-action recommendations for each signal.
- Search, category filter, status filter, and sort controls.
- Public vote flow.
- Status workflow: `Reported`, `Triaged`, `In Progress`, `Resolved`.
- Timeline updates with author and timestamp.
- CSV export for reporting and handoff.
- JSON-backed persistence for a simple deployable prototype.
- No external runtime dependencies.
- Vendored browser-only Three.js module in `public/vendor/` for offline-safe rendering.
- Dockerized deployment.
- Built-in tests using Node's native test runner.
- Accessibility polish: semantic controls, visible focus states, skip link, keyboard selection, live regions, and reduced-motion support.

## Design System

The visual direction is documented in:

```text
DESIGN.md
```

The interface is intentionally quiet and operational: warm paper background, dense but readable panels, high-contrast status chips, and restrained motion. This keeps it suitable for repeated Technical Council use while still feeling polished.

## Tech Stack

- Front end: HTML, CSS, JavaScript
- 3D scene: Three.js vendored locally
- Back end: Node.js native `http` server
- Storage: JSON file
- Tests: `node:test`
- Deployment: Docker-compatible cloud host

## Local Setup

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## Tests

```bash
npm test
```

The tests cover validation, priority scoring, stats, filtering, status timeline updates, note updates, and CSV export.

## Visual Verification

The 3D scene has been checked in Chrome at desktop and mobile widths. Canvas pixel sampling confirmed the WebGL scene is nonblank on both viewports, and a browser smoke check completed with no page errors.

## API Endpoints

```text
GET /api/issues
```

Returns issue reports. Supports query parameters:

```text
category=Water|Safety|Hostel|Transport|Labs|General|all
status=Reported|Triaged|In Progress|Resolved|all
search=<text>
sort=priority|newest|votes|status
```

```text
GET /api/issues/:id
```

Returns one issue with timeline updates.

```text
GET /api/issues.csv
```

Exports the current issue list as CSV. Supports the same query parameters as `/api/issues`.

```text
GET /api/stats
```

Returns total signals, open signals, resolved signals, total votes, top category, top priority issue, and resolution rate.

```text
POST /api/issues
```

Creates a new issue.

Example body:

```json
{
  "title": "Water cooler not working",
  "location": "Orion first floor",
  "category": "Water",
  "description": "The cooler has been empty during afternoon lab hours.",
  "contact": "student@nitt.edu"
}
```

```text
PATCH /api/issues/:id/vote
```

Adds one vote to an issue.

```text
PATCH /api/issues/:id/status
```

Updates an issue status and appends a timeline entry.

Example body:

```json
{
  "status": "In Progress"
}
```

```text
POST /api/issues/:id/updates
```

Adds a progress note to the issue timeline.

Example body:

```json
{
  "message": "Shared with hostel office for review.",
  "author": "CampusPulse volunteer"
}
```

## Docker

Build:

```bash
docker build -t campuspulse .
```

Run:

```bash
docker run -p 3000:3000 campuspulse
```

## Deployment Plan

1. Push this folder as a public GitHub repository.
2. Deploy the Docker container on Render, Railway, Fly.io, or any similar cloud host.
3. Set the service port to `3000`.
4. Replace the JSON file with PostgreSQL or another database if the project grows beyond prototype scale.

## Live Deployment

- **Railway:** https://campuspulse-nitt-production.up.railway.app
- **Vercel:** https://campuspulse-chi.vercel.app

## Future Scope

- NITT email login.
- Abuse protection for anonymous voting.
- Admin-only volunteer dashboard.
- Location clustering or map view.
- SLA-style resolution targets by category.
- Monthly public impact report generated from CSV export.
