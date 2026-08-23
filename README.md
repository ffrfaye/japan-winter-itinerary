# Japan ski trip — winter itinerary

Shareable, no-login itinerary for a group winter in Tokyo and Nozawa Onsen (27 Dec 2026 – 9 Jan 2027). Vite + React + TypeScript + Tailwind + shadcn. Light zinc list. Mobile-first.

This is a **recommended skeleton**, not a locked plan. Open decisions stay marked open. Ghibli January 2027 days are unpublished.

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

Keys this page actually reads:

- `meta.title`, `meta.datesLabel`, `meta.tone`, `meta.planningBanner`
- `group.sizeLabel`
- `statusLegend` — labels for recommended / open / locked
- `openDecisions[]` — `title`, `detail`, `status`
- `checklist[]` — urgent stays are `tokyo-hotel` and `nozawa-hotel`; later line uses `priority: "later"` plus `hakutaka`
- `route.stops` — city blocks and night counts
- `days[]` — `weekday`, `short`, `city`, `title`, `summary`, `blocks`, `status`
- `lodging` / `ghibli.unpublished` — footer notes via the matching `openDecisions` items

Status values:

- `recommended` — suggested, not group-confirmed
- `open` — still deciding, or unpublished
- `locked` — a hard constraint or a closed window

After you edit JSON, refresh the dev server.

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
- Schneider is closed through December 2027 and is not shown as bookable.
