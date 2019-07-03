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

import def from './SAM.js'

// A set of methods to use the SAM pattern
export default (SAM = def) => ({
    addInitialState: (initialState) => SAM({ initialState }),
    addComponent: (component) => SAM({ component }),
    setRender: render => SAM({ render }),
    getIntents: (actions) => SAM({ component: { actions }}),
    addAcceptors: (acceptors, privateModel) => SAM({ component: { acceptors, privateModel }}),
    addReactors: (reactors, privateModel) => SAM({ component: { reactors, privateModel }}),
    addNAPs: (naps, privateModel) => SAM({ component: { naps, privateModel }})
})