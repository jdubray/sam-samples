////////////////////////////////////////////////////////////////////////////////
// State
//

var state =  { } ;

// Derive the state representation as a function of the systen
// control state
state.representation = function(model) {
    var representation = 'oops... something went wrong, the system is in an invalid state' ;

    if (state.ready(model)) {
        representation = state.view.ready(model) ;
    } 

    if (state.counting(model)) {
        representation = state.view.counting(model) ;
    }

    if (state.launched(model)) {
        representation = state.view.launched(model) ;
    }

    if (state.aborted(model)) {
        representation = state.view.aborted(model) ;
    }

    state.view.display(representation) ;
}

// Derive the current state of the system
state.ready = function(model) {
    return ((model.counter === COUNTER_MAX) && !model.started && !model.launched && !model.aborted) ;
}

state.counting = function(model) {
    var status = ((model.counter <= COUNTER_MAX) && (model.counter >= 0) && model.started && !model.launched && !model.aborted) ;
    return status ;
}

state.launched = function(model) {
    return ((model.counter === 0) && model.started && model.launched && !model.aborted) ;
}

state.aborted = function(model) {
    return (
        (  model.counter <= COUNTER_MAX) && (model.counter >= 0) 
        && model.started && !model.launched && model.aborted ) ;
}


state.currentState = function(model) {


    if (state.ready(model)) {
        return 'ready' ;
    } 

    if (state.counting(model)) {
        return 'counting' ;
    }

    if (state.launched(model)) {
        return 'launched' ;
    }

    if (state.aborted(model)) {
        return 'aborted' ;
    }

    return 'error' ;
}


// Next action predicate, derives whether
// the system is in a (control) state where
// an action needs to be invoked

state.nextAction = function (model) {
    console.log('next action') ;
    if (state.counting(model)) {
        if (model.counter>0) {
            state.actions.decrement({counter: model.counter},model.present) ;
        }

        if (model.counter === 0) {
            state.actions.launch({},model.present) ;
        }
    }
}

state.render = function(model) {
    state.representation(model)
    state.nextAction(model) ;
}
