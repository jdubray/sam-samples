
////////////////////////////////////////////////////////////////////////////////
// View
//

let view = {
 
    // Initial State
    init(model, theme) {
        this.theme = theme || {};
        
        return view.ready(model) ;
    },

    // State representation of the ready state
    ready(model, theme) { 
        model.lastEdited = model.lastEdited || {} ;
        theme = theme || this.theme ;
        
        var output = {
            header: theme.header(model.data.header),
            footer: theme.footer(model.data.footer),
            page: theme.page(model.data) 
        }
        
        return output ;
    },


    //display the state representation
    display(representation,next) {
        if (next) {
            next(representation) ;
        } 
    }

} ;

export { view } ;