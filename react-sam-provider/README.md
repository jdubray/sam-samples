# SAM Pattern with React

A reference implementation of the [SAM pattern](http://sam.js.org) for React 18 applications, using `SAMProvider` to wire SAM instances into the React component tree.

```
npm install && npm start
```

---

## The core challenge

SAM and React have different mental models. SAM is a **synchronous, deterministic state machine**: every user event triggers a single `action → model → state → render` cycle with no interruptions. React 18 is **concurrent**: it can interrupt, pause, and replay renders.

The bridge between them is the only thing that needs care. The SAM pattern itself — actions, acceptors, NAPs — stays unchanged.

---

## How this implementation works

SAM's `setRender` normally takes a function that re-draws the UI. In React, we pass React's own `setState` as that function:

```js
// SAMProvider.js (simplified)
const [state, setState] = useState(initialState)

useEffect(() => {
  const instance = createInstance({ instanceName, clone: true })
  const { addInitialState, addComponent, setRender } = api(instance)

  addInitialState(savedState)
  const { intents } = addComponent(components)

  setRender(setState)   // ← SAM drives React's state
  setIntents(intents)
}, [])
```

The result is that every SAM cycle calls `setState(newModel)`, which triggers a React re-render with the full updated model. Components access the model and intents via `SAMContext`.

### Using it in a component

**1. Define your SAM components and wrap with `SAMProvider`:**

```jsx
// Counter.js
import { SAMProvider, useLocalStorage } from '../lib/SAMProvider'
import CounterDisplay from './CounterDisplay'

function Counter({ counterName }) {
  const initialState = { counter: 0 }

  const components = {
    actions: [
      () => ({ incBy: 1 }),
      ['INCREMENT_BY_TWO', () => ({ incBy: 2 })]
    ],
    acceptors: [
      model => proposal => {
        model.counter += proposal.incBy || 1
      }
    ]
  }

  return (
    <SAMProvider
      initialState={initialState}
      components={components}
      instanceName={counterName}
      persisted={useLocalStorage(initialState)}
    >
      <CounterDisplay />
    </SAMProvider>
  )
}
```

**2. Consume the context in child components:**

```jsx
// CounterDisplay.js
import { useContext } from 'react'
import { SAMContext, useInitializedContext } from '../lib/SAMProvider'

function CounterDisplay() {
  const { isLoading, intents, state } = useInitializedContext(useContext(SAMContext))

  if (isLoading) return <div>Loading…</div>

  const [incrementByOne, incrementByTwo] = intents

  return (
    <div>
      <p>Count: {state.counter}</p>
      <button onClick={() => incrementByOne()}>+1</button>
      <button onClick={() => incrementByTwo()}>+2</button>
    </div>
  )
}
```

---

## Multiple independent instances

Each `SAMProvider` with a unique `instanceName` runs its own isolated SAM loop. Instances do not share state:

```jsx
// App.js
function App() {
  return (
    <>
      <Counter counterName="counter-1" />
      <Counter counterName="counter-2" />
    </>
  )
}
```

---

## Optional persistence

Pass a storage adapter as the `persisted` prop. The built-in `useLocalStorage` adapter saves to `localStorage` on unmount and restores on mount:

```js
persisted={useLocalStorage(initialState)}
```

The storage key is `__SAMState_{instanceName}`. You can implement any adapter that exposes `{ getState(instanceName), setState(state, instanceName) }`.

---

## `SAMProvider` props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `instanceName` | `string` | No | Unique name for this SAM instance. Default: `'__main'` |
| `initialState` | `object` | Yes | Starting model values |
| `components` | `object` | Yes | `{ actions, acceptors, reactors, naps }` — standard sam-pattern component definition |
| `persisted` | `object` | No | Storage adapter `{ getState, setState }` |
| `children` | `ReactNode` | Yes | Components that consume `SAMContext` |

---

## Known limitations and trade-offs

### Re-render granularity
Every SAM cycle replaces the entire model, so all `SAMContext` consumers re-render together. For small components this is fine. For large apps with many consumers, add selectors or split into multiple providers with narrower state.

### React StrictMode double-invoke
React 18 StrictMode intentionally mounts → unmounts → remounts components in development. This causes `useEffect` to run twice. The provider handles this by tracking the instance in a module-level registry and cleaning up on unmount. In production this doesn't happen.

### `useSyncExternalStore` — the React 18 ideal
The cleanest integration for concurrent-mode React is to keep the SAM model **outside** React state entirely and use `useSyncExternalStore` to subscribe components:

```js
// The SAM model lives outside React
let snapshot = initialState
const listeners = new Set()

setRender(newModel => {
  snapshot = newModel
  listeners.forEach(l => l())
})

// In any component:
const state = useSyncExternalStore(
  listener => { listeners.add(listener); return () => listeners.delete(listener) },
  () => snapshot
)
```

This approach is tearing-free, works correctly with Suspense and transitions, and avoids the StrictMode double-invoke issue. It is the recommended direction if this provider is extended for production use.

---

## SAM pattern quick reference

```
User event
    │
    ▼
 Action          Transforms raw input into a proposal
    │
    ▼
 Model           Acceptors decide whether to apply the proposal
    │
    ▼
 State           Pure function: computes state representation from model
    │
    ▼
 Render          Updates the UI with the new state representation
    │
    ▼
  NAP            Next-Action Predicate: triggers automatic follow-up actions
```

See [sam.js.org](http://sam.js.org) and [sam-lib](../../sam-lib/README.md) for the full pattern documentation.
