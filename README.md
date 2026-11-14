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

## Notify form (preview)

While iterating locally, email signups are stored in the browser via `localStorage` under `mea-waitlist`.

In the browser console:

```js
MEA.getWaitlist()
MEA.clearWaitlist()
```

Before public launch, replace this with a real email/CRM integration and add online registration + tuition payment.

## Production build

```bash
npm run build
npm run preview
```

Static output is written to `dist/`.
