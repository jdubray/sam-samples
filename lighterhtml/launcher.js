// This is free and unencumbered software released into the public domain.

// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.

// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

// For more information, please refer to <http://unlicense.org/>


const { render, html } = lighterhtml;
import { step, match } from './sam-utils.js'

// Acceptors
const startAcceptor = model => ({ start }) => {
    if (start) {
        if (!model.started) {
            model.started = true
            model.launched = false
            model.aborted = false
        }
    }
}

const launchAcceptor = model => ({ launch }) => {
    if (launch) {
        if (model.started) {
            model.launched = true
            model.started = false
        }
    }
}

const abortAcceptor = model => ({ abort }) => {
  if (abort) {
      if (model.started) {
          model.started = false
          model.aborted = true
      }
  }
}

const resetAcceptor = model => ({ reset }) => {
  if (reset) {
      model.started = false
      model.aborted = false
      model.launched = false
      model.counter = 10
  }
}

const countDown = model => ({ decBy }) => {
  if (decBy) {
    if (model.started && model.counter >= decBy) {
      model.counter -= decBy
    }
  }
}


// Reactors
const statusUpdate = model => () => {
  model.status = match(
    [model.started, model.aborted, model.launched, true], 
    ['starting', 'aborted', 'launching', 'ready']
  )
} 

const currentActionUpdate = model => () => {
  model.currentAction = match(
    [model.started, model.aborted || model.launched, true],
    ['abort', 'reset', 'start']
  )
}

const Launcher = (element, SAM) => {

  const { intents } = SAM({
    component: { 
      actions: [
        // Actions are trivial in this example.
        // In general there is more work to do to  
        // create a proposal
        step,
        () => ({ start: true }),
        () => ({ launch: true }),
        () => ({ abort: true }),
        () => ({ reset: true }),
        () => ({ decBy: 1 })
      ], 
      acceptors: [
          startAcceptor,
          launchAcceptor,
          abortAcceptor,
          resetAcceptor,
          countDown
      ], 
      reactors: [
        statusUpdate,
        currentActionUpdate
      ],
      naps: [
        // decrement counter once launched
        (state) => () => { 
          state.started && !state.launched && state.counter > 0 && setTimeout(decount, 1000)
          return false
        },
        // launch rocket when countdown is complete
        (state) => () => {
          state.counter === 0 && state.started && setTimeout(launch, 0)
          return false
        }
      ] 
    }
  })

  let [
    init,
    start,
    launch,
    abort,
    reset,
    decount
  ] = intents

  SAM({
    render: (state) => {
      const currentIntent = match(
        [state.started, state.aborted || state.launched, true],
        [abort, reset, start] 
      )
      const status = state.started ? state.counter : state.status
      render(document.getElementById(element), _ => html`
        <p>Status: ${status}</p>
        <button onclick=${currentIntent}>
          ${state.currentAction}
        </button>`
      )
    }
  })

  init()
}

export default Launcher;
