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

'use strict' ;
let actions = {

    init({model, components, options}) {
        options = options || {};
        this.model = model
        this.components = components
        this.host = options.host ;
        // let self = this
        // console.log('processing intents')
        // this.components.actions.forEach( action => { 
        //     console.log(action.implementation)
        //     let impl = action.implementation
        //     console.log(impl)
        //     self.intents[action.name] = impl
        //     console.log(self.intents)
        // })
        // console.log(this.intents)
    },

    present(data) {
        return false ;
    }, 

    intents : { }, 

    dispatch(event) {
        let self = this
        this.components.actions.forEach( function (action) {
            if (action.name === event.name) {
                console.log('calling action: ' + action.name)
                action.implementation(event, null, self.model)
            } 
        })
    }
       
}

export { actions } ;