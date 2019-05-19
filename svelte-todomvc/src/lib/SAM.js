

// Model
const model = {
    _acceptors: [],
    present(proposal) {
        // acceptors

        model._acceptors.forEach(a => a(proposal));

        // Continue to state representation
        state()
    }
}


// State Represenation
let _render = () => null;
let _reactors = [];
const state = () => {
    // Reactors would go here
    
    _reactors.forEach(r => r());

    _render(model)
}


const init = (component, act, render = _render) => {
    const { actions, acceptors, reactors } = component;

    if (actions && acceptors && reactors) {
        // Initialize the SAM elements
        const _actions = actions.map(a => a(model.present));
        acceptors.map(a => model._acceptors.push(a(model)));
        _reactors = reactors.map(r => r(model));
        return _actions;
    } else {
        // Process an action
        _render = render
        // get initial state from app
        Object.assign(model, component.get());
        act();
    }
}

export default init;
