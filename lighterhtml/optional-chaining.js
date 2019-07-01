// shim for optional chaining
// https://github.com/tc39/proposal-optional-chaining

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


const O = (val, value = {}) => val && (typeof val === 'object') ? val : value
const A = (val, value = []) => val && Array.isArray(val) ? val : value
const S = (val, value = '') => val && (typeof val === 'string') ? val : value
const N = (val, value = 0) => isNaN(val) ? value : val
const NZ = (val, value = 1) => val === 0 || isNaN(val) ? value === 0 ? 1 : value : val
const F = (f, f0 = () => null) => f ? f : f0

const e = value => Array.isArray(value) 
    ? value.map(e).reduce(and)
    : value !== null && value !== undefined

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

const on = (value, f) => { 
    e(value) && f(value) 
    return mon(e(value)) 
}

const mon = (triggered = true) => ({
    on: triggered ? (value, f) => mon() : on
})

const or = (acc, current) => acc || current
const and = (acc, current) => acc && current

export {O, A, S, N, NZ, F, E, on, or, and}