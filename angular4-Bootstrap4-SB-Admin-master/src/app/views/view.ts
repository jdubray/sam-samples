// import {SAMTheme}    from './theme' ;

////////////////////////////////////////////////////////////////////////////////
// View
//
export class View {

    // var theme = SAMTheme() ;
    // State representation of the ready state

    private _display: (sr: any) => any;

    init(display: (sr: any) => any) {
        this._display = display;
    }

    ready(model: any, intents: any) {
        // generate the representation of each component
        return ({ productDetails: model.productDetails });

        // return ({
        //     appHeader: theme.header(model.startWith ,intents),
        //     peopleList: theme.list(model, intents),
        //     filters: theme.filters(model.count, intents),
        //     dynamic: model.count
        // });
    }

    // display the state representation
    display(representation: any, intents: any) {
        this._display(representation);
    }

};


