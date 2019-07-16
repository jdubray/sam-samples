import React from 'react';
import ReactDOM from 'react-dom';
import '../node_modules/todomvc-app-css/index.css';
import { TodoAppFactory, TodoApp }  from './sam/TodoApp';
import * as serviceWorker from './serviceWorker';

import initialState from './sam/initialState.js'
import todo from './sam/todoComponent.js'
import { createInstance, api } from 'sam-pattern'

// Creates a SAM instance that clones the model before rendering
const { addInitialState, addComponent, setRender } = api(createInstance({ clone: true }))

// wire it up  
addInitialState(initialState)
const { intents } = addComponent(todo)
const todoApp = TodoAppFactory(intents, initialState)
setRender(todoApp)

// // start your application
ReactDOM.render(<TodoApp />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
