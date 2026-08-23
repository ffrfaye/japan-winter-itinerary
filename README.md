# Japan ski trip — winter itinerary

Shareable, no-login itinerary for a group winter in Tokyo and Nozawa Onsen (27 Dec 2026 – 9 Jan 2027). Vite + React + TypeScript. Mobile-first. Every trip fact lives in one JSON file.

This is a **recommended skeleton**, not a locked plan. Open decisions (NYE fork, lodging, Ghibli calendar, headcount, airport, optional Fukuoka concert) stay marked as open or unpublished.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # serve the built files
```

## Edit the trip (this is the only source of facts)

Change **`src/data/trip.json`**. The UI imports that file and does not invent dates, prices, or venues.

Typical edits:

- `meta` — title, dates, nights, the planning banner
- `route` — Tokyo → Nozawa → Tokyo strip
- `days` — each calendar day, expandable blocks, status chips, research links
- `openDecisions` — NYE fork, concert, lodging, Ghibli, headcount
- `checklist` — the book-now list
- `lodging`, `transport`, `ski`, `ghibli`, `concert`, `snowMonkeys`

Status values:

- `recommended` — suggested, not group-confirmed
- `open` — still deciding, or unpublished
- `locked` — a hard constraint or a closed window (Schneider renovation, FC lotteries closed, “do not claim Ghibli tickets exist”)

After you edit JSON, refresh the dev server. No rebuild of copy-paste facts in components.

## Share as a GitHub Pages URL

The workflow in `.github/workflows/deploy.yml` builds on every push to `main` and deploys to GitHub Pages.

1. In the GitHub repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Merge this project to `main` (or run the workflow from the Actions tab).
3. The site URL will be:

   `https://ffrfaye.github.io/japan-winter-itinerary/`

The production build sets `base` to `/japan-winter-itinerary/` so assets resolve on project Pages. Local `npm run dev` still uses `/`.

If the repository is ever renamed, change the `base` path in `vite.config.ts` to match.

## What this site is not

- Not a booking engine and not a login app.
- Not a claim that Ghibli January 2027 tickets exist.
- Not an Osaka / Kyoto / Nagoya / Ghibli Park itinerary.
- Checklist ticks are stored in the visitor’s browser only.
