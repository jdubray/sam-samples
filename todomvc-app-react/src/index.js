import React from 'react';
import { createRoot } from 'react-dom/client';
import '../node_modules/todomvc-app-css/index.css';
import { TodoAppFactory, TodoApp }  from './sam/TodoApp';

import initialState from './sam/initialState.js'
import todo from './sam/todoComponent.js'
import { createInstance, api } from '@cognitive-fab/sam-pattern'

// Creates a SAM instance that clones the model before rendering
const { addInitialState, addComponent, setRender } = api(createInstance({ clone: true }))

// wire it up
addInitialState(initialState)
const { intents } = addComponent(todo)
const todoApp = TodoAppFactory(intents, initialState)
setRender(todoApp)

// start your application
const root = createRoot(document.getElementById('root'))
root.render(<TodoApp />)
