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

import { A, on, or } from './optional-chaining.js'

// This is an implementation of SAM using SAM's own principles
// - SAM's internal model
// - SAM's internal acceptors
// - SAM's present function 

const SAM = (function() {
    // SAM's internal model
    let intents
    const acceptors = []
    const reactors = []
    const naps = []
    let dontRenderOnNAP = false
    
    // ancillary
    let renderView = () => null
    const react = r => r()
    const accept = proposal => a => a(proposal)
    const stateRepresentation = model => model.data

    // Model
    const model = {
        data: {},
        present(proposal) {
            // accept proposal
            acceptors.forEach(accept(proposal))

            // Continue to state representation
            state()
        }
    }

    // State Representation
    const state = () => {
        // Update state representation
        reactors.forEach(react)

        // render state representation
        if (!dontRenderOnNAP) {
            renderView(stateRepresentation(model))
            // next-action
            naps.map(n => n())
        } else {
            !naps.map(n => n()).reduce(or, false) && renderView(model.data)
        }
    }

    // SAM's internal acceptors
    const set = (initialState = {}) => Object.assign(model.data, initialState)

    const mount = (arr = [], elements = [], operand = model.data) => elements.map(e => arr.push(e(operand)))

    const add = (component = {}) => {
        // Add component's acceptors and reactors to SAM
        intents = A(component.actions).map(action => action(model.present))
        mount(acceptors, component.acceptors)
        mount(reactors, component.reactors)
        mount(naps, component.naps)
    }

    const setRender = render => {
        renderView = render
    }

    // SAM's internal present function
    return ({ initialState, component, act, render }) => {
        intents = [];

         on(initialState,   set)
        .on(component,      add)
        .on(act,            act)
        .on(render,         setRender)

        return {
            intents
        }
    }
})()

export default SAM;
