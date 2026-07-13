# SAM Samples

[SAM (State-Action-Model)](http://sam.js.org) is a reactive functional pattern that simplifies front-end and back-end architecture by clearly separating business logic from the view. All samples use the local [sam-pattern](../sam-lib) library build.

> **✨ New: [v2 samples](v2/)** — twelve samples for sam-lib 2.0's **strict profile** (named intents with schemas, sealed model shape, `reject(reason)`, keyed acceptors, input domains + in-browser model checking), ordered from hello-world to a time-travel debugger, using vanilla JS, Alpine.js, VanJS, lit-html, Preact, Vue 3, petite-vue, Web Components, and canvas. Self-contained: `npx serve v2`.

## Running Samples

Serve from the `sam/` workspace root so that relative paths to `../../sam-lib/dist/SAM.js` resolve correctly:

```sh
npx http-server -p 3000 .
# then open http://localhost:3000
```

`http://localhost:3000` loads an index page with links to all samples below. Samples marked **build required** need `npm install` (and `npm start` / `ng serve`) run inside their directory.

---

## TodoMVC

Full [TodoMVC](http://todomvc.com) implementations across multiple frameworks:

| Sample | Framework | Notes |
|--------|-----------|-------|
| [todomvc-app](./todomvc-app) | Vanilla JS | Reference implementation |
| [todomvc-app-lit-html](./todomvc-app-lit-html) | lit-html | `npm install` required |
| [todomvc-app-vue](./todomvc-app-vue) | Vue 2.6 + Vue Router | `npm install` required |
| [todomvc-app-angular](./todomvc-app-angular) | Angular 7 | `npm install && ng serve` |
| [todomvc-app-react](./todomvc-app-react) | React 18 CRA | `npm install && npm start` |

## Vanilla JS

| Sample | Description |
|--------|-------------|
| [vanilla-child-instance](./vanilla-child-instance) | Parent/child SAM instance relationship |
| [vanilla-focus-fields](./vanilla-focus-fields) | Form focus management with timesheet |
| [vanilla-api-calls](./vanilla-api-calls) | Async API calls (requires external server) |

## React (CDN — no build needed)

| Sample | Description |
|--------|-------------|
| [react-counter](./react-counter) | Minimal click counter with React 15 + JSX |
| [react-child-instance](./react-child-instance) | Multi-step form with parent/child SAM instance |
| [react-sam-provider](./react-sam-provider) | React 18 Context Provider wrapping a SAM instance — `npm install && npm start` |

## Alternative Renderers

| Sample | Description |
|--------|-------------|
| [inferno-rocket](./inferno-rocket) | Rocket launcher with [Inferno](https://infernojs.org/) vdom |
| [lighterhtml](./lighterhtml) | lighterhtml renderer + sam-pattern |

## Server-Side (Node.js)

| Sample | Description | Start command |
|--------|-------------|---------------|
| [crud-blog](./crud-blog) | Express CRUD blog | `npm start` → `localhost:5425/html/blog.html` |
| [server-side-timetravel-store](./server-side-timetravel-store) | Express + in-memory time-travel snapshot store | `npm start` |

---

## Tests

Puppeteer smoke tests cover all browser-based samples above:

```sh
cd tests
npm install
node samples.test.js
```

---

## Change Log

- 2026-03-27 Removed hash-dom from active samples (not fixable for Puppeteer testing)
- 2026-03-27 Fixed todomvc-app-vue `<base href>` so scripts resolve correctly under http-server
- 2026-03-27 Fixed inferno-rocket absolute script paths (`/inferno.min.js` → `inferno.min.js`)
- 2026-03-27 Fixed vanilla-child-instance `this`-binding bugs in object literal methods
- 2026-03-27 Fixed vanilla-focus-fields `cmodel.urrentIndex` typo
- 2026-03-27 Added Puppeteer smoke test suite covering all active browser samples
- 2026-03-27 Added `sam/index.html` launcher page with correct `/sam-samples/...` paths
- 2026-03-27 Ran `npm install` for todomvc-app-lit-html and todomvc-app-vue
- 2026-03-27 Polished READMEs for sam-lib, sam-fsm, and sam-samples
- 2026-03-27 Replaced all CDN and npm `sam-pattern` references with the local `sam-lib` build
- 2026-03-27 Upgraded todomvc-app-react from React 16 to React 18 (`createRoot` API)
- 2026-03-27 Removed obsolete samples: Angular 2, Angular 4, AWS Alexa, Svelte
