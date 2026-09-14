# Japan ski trip — winter itinerary

Shareable, no-login itinerary for a group winter in Tokyo and Yomase (27 Dec 2026 – 9 Jan 2027). Vite + React + TypeScript + Tailwind + shadcn. Light zinc list. Mobile-first.

**Booked:** Faye + Will flights United **GSCT9K**; ski house **AlpineCottage Ryuo** (Airbnb **HMCZA2Z53J**), 30 Dec 2026–5 Jan 2027.

**Open:** Tokyo lodging both ends, cars / IDPs, other guests’ flights, lifts, monkeys / Shibu, Ghibli if last city is Tokyo 6–8 Jan. The site does not invent holds.

Ghibli Museum Mitaka calendar is published (open 3–9 Jan 2027; closed 27 Dec 2026–2 Jan 2027). Tickets are not on sale.

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

Change **`src/data/trip.json`**, **`src/data/budget.json`**, **`src/data/lodging-cards.json`**, and **`src/data/flights-scenarios.json`**. The UI imports those files and does not invent dates, prices, or venues.

Hash tabs: `#itinerary` (default), `#lodging`, `#planning`, `#budget`, `#flights`.

Status values:

- `recommended` — a suggested extra, not a booking
- `open` — still deciding, or unpublished
- `calendar-published` — official open days are listed; not a booking
- `locked` — a confirmed fact we will not pretend is flexible

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
- Not a changelog of cancelled houses.
- Schneider is closed through December 2027 and is not shown as bookable.
