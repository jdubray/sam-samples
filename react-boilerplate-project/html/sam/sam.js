
import { state }       from './state' ; 
import { model }       from './model' ;
import { actions }     from './actions' ;
import { view }        from './view' ;

let SAM = { 
    init: function({theme, data, modules, display, options}) {

        let components = {
            actions:[],
            acceptors: [],
            reactors: [],
            filters:[],
            postProcessings: [],
            intents: [],
            states: {
                "ready": {
                        nextAction: () => {}
                    }
            },
            data: data
        } 

        console.log('processing includes')
        modules.forEach( function (include) {
            components.acceptors = components.acceptors.concat(include.acceptors)
            components.actions = components.actions.concat(include.actions)
            components.reactors = components.reactors.concat(include.reactors)

        })

        this.components = components

        console.log('wiring SAM')
        this.state.init(this.view, theme, display, components) 
        this.model.init({state: this.state, components, options}) 
        this.actions.init({model: this.model, components, options}) 
        this.view.init(this.model, theme(actions, options))

        // init
        console.log('initial rendering')
        this.state.representation(this.model) ;
    },

    state: state,

    model: model,

    actions: actions, 

    view: view
}

export { SAM }