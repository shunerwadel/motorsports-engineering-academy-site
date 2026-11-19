# Motorsports Engineering Academy — Course Site

Landing page for the **Race Engineering Course**: a 4-week high school masterclass in vehicle dynamics, simulation, data acquisition, and performance analysis.

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

- Edit copy in `index.html`
- Edit look-and-feel in `src/styles.css`
- Notify-form behavior lives in `src/main.js`

Brand assets are in `public/` (logo). Flyer and source docs used for content are under `design-ref/` for reference only.

## Notify form

Signups are emailed through [Formspree](https://formspree.io) to the inbox configured on that form (intended: `scottyhunerwadel@gmail.com`).

1. Create a free form at https://formspree.io and point it at that Gmail address.
2. Copy the form id from the endpoint (`https://formspree.io/f/xxxxxx` → `xxxxxx`).
3. Paste it into `FORMSPREE_FORM_ID` in `src/main.js`.

Online registration + tuition payment still need to be added before launch.

## Production build

```bash
npm run build
npm run preview
```

Static output is written to `dist/`.

## GitHub Pages

The site deploys automatically on every push to `main` via `.github/workflows/deploy-pages.yml`.

1. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Merge to `main` (or run the workflow manually under **Actions**).
3. Site URL: `https://shunerwadel.github.io/motorsports-engineering-academy-site/`

The workflow sets `BASE_PATH` so asset URLs work under the `/motorsports-engineering-academy-site/` project path.
