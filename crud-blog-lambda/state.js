////////////////////////////////////////////////////////////////////////////////
// State
///////////////////////////////////////////////////////////////////////////////
// This is free and unencumbered software released into the public domain.
//
// Anyone is free to copy, modify, publish, use, compile, sell, or
// distribute this software, either in source code form or as a compiled
// binary, for any purpose, commercial or non-commercial, and by any
// means.
//
// In jurisdictions that recognize copyright laws, the author or authors
// of this software dedicate any and all copyright interest in the
// software to the public domain. We make this dedication for the benefit
// of the public at large and to the detriment of our heirs and
// successors. We intend this dedication to be an overt act of
// relinquishment in perpetuity of all present and future rights to this
// software under copyright law.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
// OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// For more information, please refer to <http://unlicense.org/>


var state =  { } ;

state.init = function(render, view, display, intents) {
    
    if (render !== undefined) { 
        state.view = view ; 
        state.display = display || view.display ;
    }
    
    if (intents !== undefined) { state.intents = intents ; }
    
    if (render !== null) { state.render = render ; }
    
} ;

// Derive the state representation as a function of the systen
// control state
state.representation = function(model,next) {
    var representation = 'oops... something went wrong, the system is in an invalid state' ;

    if (state.ready(model)) {
        representation = state.view.ready(model, state.intents) ;
    } 
    
    state.display(representation,next) ;
    
    // return allowed actions
    return ['edit', 'save', 'delete', 'cancel'] ;
} ;

// Derive the current state of the system
state.ready = function(model) {
   return true ;
} ;


// Next action predicate, derives whether
// the system is in a (control) state where
// a new (next) action needs to be invoked

state.nextAction = function(model) {} ;

state.render = function(model,next) {
    console.log('in render') ;
    state.representation(model,next) ;
    state.nextAction(model) ;
} ;

module.exports = state ;