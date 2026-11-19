# vIDE Simple Gauge app

The original ring-gauge look for [vIDE](https://github.com/DarthTigerson/vIDE)'s usage panel, packaged as a vSuite Store app (category Usage) on vIDE's app API v1 (needs vIDE 0.3.7+). Pick it by right-clicking the usage panel, then View, then Simple Gauge.

Layout:

- `src/renderer/` becomes `renderer.js` (ES module; React comes from `globalThis.__videShared`, never bundled) plus a scoped `style.css`. The app has no `main.js`.
- `SimpleGauge.tsx` is the whole look: it receives `{ session, week, now }` from the panel and only draws. `UsageStats.tsx` holds the ring gauge and stat blocks.
- `src/vide.d.ts` is a copy of vIDE's app API types.

## Dev loop

```bash
npm install
npm run build        # writes dist/
npm test             # component tests
npx tsc --noEmit     # type check
```

In a dev vIDE run the palette command **Load app from folder…** and pick `dist/`.

## Packaging

```bash
npm run build && npm run package
```

Writes `release/simple-gauge-<version>.zip` and prints its sha256 and size.

## Releasing

Push a tag like `v0.1.1`. The Release workflow takes the version from the tag, runs the tests, builds the zip and publishes a GitHub release with it.

## Store page content

- `manifest.json` `description`: the one-line summary on the Store card.
- `store/README.md`: the About text on the Store page.
- `assets/icon.svg`: the app icon.
