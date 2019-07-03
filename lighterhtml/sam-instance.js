// ISC License (ISC)
// Copyright 2019 Jean-Jacques Dubray

// Permission to use, copy, modify, and/or distribute this software for any purpose 
// with or without fee is hereby granted, provided that the above copyright notice 
// and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH 
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND 
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, 
// OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA 
// OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, 
// ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import { A, on, or } from './sam-utils.js'

// This is an implementation of SAM using SAM's own principles
// - SAM's internal model
// - SAM's internal acceptors
// - SAM's present function 

export default function() {
    // SAM's internal model
    let intents
    const acceptors = []
    const reactors = []
    const naps = []
    
    // ancillary
    let renderView = () => null
    const react = r => r()
    const accept = proposal => a => a(proposal)
    const mount = (arr = [], elements = [], operand = model) => elements.map(e => arr.push(e(operand)))

    // Model
    const model = {}

    const present = (proposal) => {
        // accept proposal
        acceptors.forEach(accept(proposal))

        // Continue to state representation
        state()
    }

    // State Representation
    const state = () => {
        // Compute state representation
        reactors.forEach(react)

        // render state representation (gated by nap)
        !naps.map(react).reduce(or, false) && renderView(model)
    }

    // SAM's internal acceptors
    const addInitialState = (initialState = {}) => Object.assign(model, initialState)

    // add one component at a time, returns array of intents from actions
    const addComponent = (component = {}) => {
        // Decorate actions to present proposal to the model
        intents = A(component.actions).map(action => async (...args) => present(await action(...args)))
        // Add component's acceptors,  reactors and naps to SAM
        mount(acceptors, component.acceptors, component.privateModel)
        mount(reactors, component.reactors, component.privateModel)
        mount(naps, component.naps, component.privateModel)
    }

    const setRender = render => {
        renderView = render
    }

    // SAM's internal present function
    return ({ initialState, component, render }) => {
        intents = [];

         on(initialState,   addInitialState)
        .on(component,      addComponent)
        .on(render,         setRender)

        return {
            intents
        }
    }
}
