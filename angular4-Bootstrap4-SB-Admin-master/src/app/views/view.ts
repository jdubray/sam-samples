//import {SAMTheme}    from './theme' ;

////////////////////////////////////////////////////////////////////////////////
// View
//
export function View() { 
     //var theme = SAMTheme() ;
     // State representation of the ready state


    return {
        // Initial State
        test() {},

        init(model: any, intents: any) {
            return this.ready(model, intents) ;
        }, 

        ready(model: any, intents: any) { 
            // generate the representation of each component
            return ({productDetails: model.productDetails}) ;

            // return ({ 
            //     appHeader: theme.header(model.startWith ,intents),
            //     peopleList: theme.list(model, intents), 
            //     filters: theme.filters(model.count, intents),
            //     dynamic: model.count
            // });
        },

        //display the state representation
        display(representation: any, intents: any) {
            //display the state representation
            console.log('[ERROR] something went wrong, display is not initialized') ;
            console.log(representation) ;
        }

    }

} ;


