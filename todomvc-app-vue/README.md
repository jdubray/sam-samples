# vue-todo-app

Based on on Adrian Mejia's tutorial [Learn Vue.js doing a Todo app with routing](https://adrianmejia.com/vue-js-tutorial-for-beginners-create-a-todo-app/)

The business logic has been entirely externalized (`sam.js`) and the two-way data binding has been eliminated.

Vue requires direct access to the application state. This is accomplished via the addComponent method:
```javascript
const { intents, state } = addComponent({...})
```

It seemed easier to overlay some bits of rendering logic on top of it:
```
const localState = (prop) => {
  if (prop && typeof prop === 'object') {
    const todos = state()._todos;
    const index = todos.indexOf(prop);
    return todos[index];
  }
  if (prop === 'todos') {
    return state('_todos');
  }
  return state(prop);
}
```

