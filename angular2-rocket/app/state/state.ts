/////////////////////////////////////////////////////////////////////////////////
// State
//
export function State() { 
    var _view : any ;
    var _actions : any ;
    var _intents : any ;

    // Derive the state representation as a function of the systen
    // control state
    var _representation = (model: any) => {
        var representation = 'oops... something went wrong, the system is in an invalid state' ;

        if (_ready(model)) {
            representation = _view.ready(model, _intents) ;
        } 

        if (_counting(model)) {
            representation = _view.counting(model, _intents) ;
        }

        if (_launched(model)) {
            representation = _view.launched(model, _intents) ;
        }

        if (_aborted(model)) {
            representation = _view.aborted(model, _intents) ;
        }

        _view.display({ container: representation}) ;
    }

    // Derive the current state of the system
    var _ready = (model: any) => {
        return ((model.counter === model.COUNTER_MAX) && !model.started && !model.launched && !model.aborted) ;
    }


    var _counting = (model: any) => {
        var status = ((model.counter <= model.COUNTER_MAX) && (model.counter >= 0) && model.started && !model.launched && !model.aborted) ;
        return status ;
    }

    var _launched = (model: any) => {
        return ((model.counter === 0) && model.started && model.launched && !model.aborted) ;
    }

    var _aborted = (model: any) => {
        return (
            (  model.counter <= model.COUNTER_MAX) && (model.counter >= 0) 
            && model.started && !model.launched && model.aborted ) ;
    }


    var _currentState = (model: any) => {


        if (_ready(model)) {
            return 'ready' ;
        } 

        if (_counting(model)) {
            return 'counting' ;
        }

        if (_launched(model)) {
            return 'launched' ;
        }

        if (_aborted(model)) {
            return 'aborted' ;
        }

        return 'error' ;
    }


    // Next action predicate, derives whether
    // the system is in a (control) state where
    // an action needs to be invoked

    var _nextAction = function (model: any) {
        console.log('next action') ;
        if (_counting(model)) {
            if (model.counter>0) {
                _actions.decrement({counter: model.counter},model.present) ;
            }

            if (model.counter === 0) {
                _actions.launch({},model.present) ;
            }
        }
    }

    var _render = (model: any) => {
        _representation(model)
        _nextAction(model) ;
    }

    return {
            init: (view: any, actions: any, intents?: any) => { 
                
                _view = view ;
                _intents = intents ||  actions.intents;
                _actions = actions ;
        
            },

            // Derive the current control state of the system
            ready: _ready,

            counting: _counting,

            launched: _launched,

            aborted: _aborted,            
            

            render: _render 
        }
} ;        