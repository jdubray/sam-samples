# SAM v2 Samples — the Strict Profile

Twelve samples for [sam-lib 2.0](https://github.com/jdubray/sam-lib/tree/v2) (`@cognitive-fab/sam-pattern@2.0.0-alpha`), ordered from a two-minute hello-world to full verification tooling. Every sample runs the **strict profile**: named intents with payload schemas, a declared sealed model shape, first-class `reject(reason)`, per-action acceptors, and declared input domains.

## Running

The v2 build is vendored at [`lib/SAM.js`](lib/SAM.js) (UMD, global `tp`), so the samples work from a plain static server:

```
npx serve v2        # or: python -m http.server --directory v2
```

then open `http://localhost:3000/01-counter-vanilla/`. UI libraries load from CDNs (pinned versions; SRI hashes on classic scripts).

## The samples

| # | Sample | UI library | What it demonstrates |
|---|--------|-----------|----------------------|
| 01 | [Counter](01-counter-vanilla/) | vanilla | The v2 hello-world: named intents, a payload schema, and the "break it" button — a dropped payload throws `SamSchemaError` instead of no-oping |
| 02 | [Temperature Converter](02-temperature-alpine/) | Alpine.js | Derived keys computed by reactors; out-of-range input `reject`ed with a reason shown live |
| 03 | [Stopwatch](03-stopwatch-vanjs/) | VanJS | Timestamps computed in actions (the impure edge) so acceptors stay pure and replayable; guards on stop/lap/reset |
| 04 | [Rocket Launcher](04-rocket-launcher-lit/) | lit-html | The canonical SAM sample: countdown driven by a next-action predicate, every attempt classified in a step log |
| 05 | [Todos](05-todos-preact/) | Preact + htm | View as a pure function of the model snapshot; list replacement (not splicing) keeps mutation tracking exact |
| 06 | [Contacts CRUD](06-crud-vue/) | Vue 3 | Master–detail with one keyed acceptor per action — no dispatch switch; `validate()` shown in the footer |
| 07 | [Checkout Wizard](07-wizard-petite-vue/) | petite-vue | A wizard as a guarded FSM: the reason "Next" refuses to advance comes from the rejection log, never a silent failure |
| 08 | [Star Rating](08-rating-webcomponent/) | Web Components | One isolated strict instance per custom element; SAM instances compose like components |
| 09 | [Snake](09-snake-canvas/) | canvas | A game as a state machine: frames are `Tick` proposals, reversing into yourself is rejected, the board lives in one sealed model |
| 10 | [Raft Visualizer](10-raft-visualizer/) ★ | vanilla | **Original.** The leader-election spec from the SAM↔TLA+ study, live: every step classified `mutated` / `rejected(reason)` — enabledness observability |
| 11 | [Model Checker Playground](11-checker-playground/) ★ | vanilla | **Original.** In-browser model checking with zero harness configuration — domains come from the spec; toggle the overdraft guard and watch the checker find the violation |
| 12 | [Time-Travel Debugger](12-time-travel-debugger/) ★ | vanilla | **Original.** `setState(getState())` is total over the declared shape, so any logged step re-pins exactly; rejected steps appear in the timeline too |

★ = new in v2, not ports of earlier samples.

## The pattern in every sample

```js
const instance = tp.createInstance({ strict: true })

const { intents } = instance({
  initialState: { count: 0 },
  component: {
    modelShape: { count: { type: 'number' } },              // SAM's VARIABLES
    actions: {
      Increment: {
        action: by => ({ by }),
        schema: { by: { type: 'number', required: true } }, // throws on bad payloads
        domain: [1, -1]                                     // SAM's CONSTANTS
      }
    },
    acceptors: {
      Increment: model => ({ by }, { reject }) => {         // keyed: guards + mutations only
        if (somethingWrong) return reject('why')            // observable enabledness
        model.count += by
      }
    }
  },
  stepListener: step => { /* mutated | rejected | identity-by-mutation | unhandled */ },
  render: state => { /* view = f(state) */ }
})
```

The older v1 samples remain in the repository root for reference; they run unchanged against 2.0 (the strict profile is opt-in).
