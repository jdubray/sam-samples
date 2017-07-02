import { state } from './state.js';
import { model } from './model.js';
import { actions } from './actions.js';
import { view } from './view.js';


// wire the elements of the pattern
state.init(view);
model.init(state);
actions.init(model.present);

// init
state.representation(model);

export { actions };