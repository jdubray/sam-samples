import { theme } from './theme.js';

////////////////////////////////////////////////////////////////////////////////
// View
//
export var view = {};

// Initial State
view.init = (model, intents) => {
    return view.ready(model, intents);
};

// State representation of the ready state
view.ready = (model, intents) => {

    // generate the representation of each component
    return ({
        todoHeader: theme.header(intents),
        todoList: theme.list(model.items, model.displayActive, model.displayCompleted, intents),
        filters: theme.filters(model.displayActive, model.displayCompleted, model.count, model.completedCount, intents)
    });
};


//display the state representation
view.display = (representation) => {

    // mount each component in the corresponding div
    Object.keys(representation).forEach(function (el) {
        const component = document.getElementById(el);
        component.innerHTML = representation[el];
    });

    // clean up edited field
    const inputField = document.getElementById('new-todo');
    inputField.value = '';
};

