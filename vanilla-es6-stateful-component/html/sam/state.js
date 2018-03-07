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


var state = {

    init(view, theme, display, components, render, intents) {
        
        this.view = view ; 
        this.display = display || view.display ;    

        if (components) { this.components = components ; }
                
        if (render) { 
            this.render = render ;
        }
        
        if (intents) { this.intents = intents ; }

        if (theme) { this.theme = theme ; }
    
    }, 

    // Derive the state representation as a function of the systen
    // control state
    representation(model, theme, next) {
        var representation = 'oops... something went wrong, the system is in an invalid state' ;

        if (this.ready(model)) {
            representation = this.view.ready(model, theme, this.intents) ;
        } 
        
        this.display(representation,next) ;
        
        // return allowed actions
        return [] ;
    },

    // Derive the current state of the system
    ready(model) {
        return true ;
    }, 


    // Next action predicate, derives whether
    // the system is in a (control) state where
    // a new (next) action needs to be invoked

    nextAction(model) {

    },

    render(model,next) {
        console.log(model) ;
        this.representation(model,next) ;
        this.nextAction(model) ;
    }
} ;

export { state } ;