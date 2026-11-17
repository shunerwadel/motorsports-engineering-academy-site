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

The Notify Me form posts signups to [FormSubmit](https://formsubmit.co) and emails them to `scottyhunerwadel@gmail.com`.

**First-time activation:** the first live submission sends FormSubmit a confirmation email to that Gmail address. Open it and click the confirmation link once; later signups then deliver automatically.

Online registration + tuition payment still need to be added before launch.

## Production build

```bash
npm run build
npm run preview
```

Static output is written to `dist/`.
