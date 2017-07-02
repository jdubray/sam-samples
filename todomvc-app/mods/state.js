import { actions } from './actions.js';

////////////////////////////////////////////////////////////////////////////////
// State
//
export var state = {};

state.init = view => {

    state.view = view;

};

// Derive the state representation as a function of the systen
// control state
state.representation = (model) => {
    var representation = 'oops... something went wrong, the system is in an invalid state';

    // This is where the State decides which component of the View should be displayed
    // here the we designed the application with a single (control) State (~page)
    // In a real-world application there would be many control states and which
    // would trigger the display of different components    
    if (state.ready(model)) {
        representation = state.view.ready(model, actions.intents);
    }

    // complete the reactive loop
    state.view.display(representation);
};

// Derive the current state of the system
state.ready = function (model) {
    return true;
};



// Next action predicate, derives whether
// the system is in a (control) state where
// a new (next) action needs to be invoked

state.nextAction = (model) => { };

state.render = (model) => {
    state.representation(model);
    state.nextAction(model);
};


