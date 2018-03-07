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



////////////////////////////////////////////////////////////////////////////////
// Model 
//

// API Endpoints

var model = { 
        data : {},
        update: {},


    init(state, components, options) {
        this.state = state ;
        this.components = components ;
        this.host = options ;
        this.data = components.data ;

        this.update.h = true ;
        this.update.p = true ;
        this.update.f = true ;
        
    },

    applyFilters(data) {
    
        // filters

        // provide some hints as to what changed 
        // in the model to render the view
        this.update.h = false ;
        this.update.p = false ;
        this.update.f = false ;
        this.update.render = true ;

        this.components.filters.forEach(function(filter) {
            filter(this,data) ;
        }).bind(this) ;

    },

    CRUD(data) {

        // CRUD

       this.components.updates.forEach( function(update) {
           update(this,data) ;
       }).bind(this) ;
        
    },


    postProcessing(){

        // perform ancillary assignments
        
        this.components.postProcessings.forEach(function(post) {
            post(this,data) ;
        }).bind(this) ;
    },
                
    present(data,next) {
        data = data || {} ;
    
        this.presentFilters(data) ;

        this.CRUD(data) ;    

        this.postProcessing() ;
    
        if (this.update.render) { this.state.render(model,next) ; }
    }

} 

export { model } ;