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


// Optional chaining implementation
const O = (val, value = {}) => val && (typeof val === 'object') ? val : value
const A = (val, value = []) => val && Array.isArray(val) ? val : value
const S = (val, value = '') => val && (typeof val === 'string') ? val : value
const N = (val, value = 0) => isNaN(val) ? value : val
const NZ = (val, value = 1) => val === 0 || isNaN(val) ? value === 0 ? 1 : value : val
const F = (f, f0 = () => null) => f ? f : f0

// Util functions often used in SAM implementations
const e = value => Array.isArray(value) 
    ? value.map(e).reduce(and)
    : value === true || (value !== null && value !== undefined)

const i = (value, element) => {
    switch(typeof value) {
        case 'string': return typeof element === 'string' && value.includes(element)
        case 'object': return Array.isArray(value) 
            ? value.includes(element)
            : typeof element === 'string' && e(value[element])
    }
    return value === element
}

const E = (value, element) => 
    e(value) && e(element) 
    ? i(value,element)
    : e(value)

const oneOf = (value, f) => { 
    e(value) && f(value) 
    return mon(e(value)) 
}

const on = (value, f) => { 
    e(value) && f(value) 
    return { on }
}

const mon = (triggered = true) => ({
    oneOf: triggered ? (value, f) => mon() : oneOf
})

const first = (arr = []) => arr[0]
const or = (acc, current) => acc || current
const and = (acc, current) => acc && current
const match = (conditions, values) => first(conditions.map((condition, index) => condition ? values[index] : null).filter(e))
const step = () => ({})

export {O, A, S, N, NZ, F, E, on, oneOf, or, and, match, step}