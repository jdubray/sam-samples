const { addInitialState, addComponent, setRender } = tp

const LOCAL_STORAGE_KEY = 'todo-app-vue';
// wire it up
addInitialState({
    _todos: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [
    { text: 'Learn JavaScript ES6+ goodies', isDone: true },
    { text: 'Learn Vue', isDone: false },
    { text: 'Build something awesome with SAM', isDone: false },
    ],
    editingTodo: null,
    newTodo: null,
})

const { intents, state } = addComponent({
    actions:[
        () => ({}),
        todo => ({ complete: todo }),
        todo => ({ del: todo }),
        () => ({ clear: true }),
        (event) => ({ text: event.target.value })
    ],
    acceptors:[
        model => ({ complete }) => {
            if (complete) {
                complete.isDone = !complete.isDone
            }
        },
        model => ({ del }) => {
            if (del) {
                const index = model._todos.indexOf(del);
                model._todos[index].isDeleted = true;
            }
        },
        model => ({ clear }) => {
            if (clear) {
                model.completedTodos.forEach(t => t.isDeleted = true);
            }
        },
        model => ({ text }) => { 
            if (text) {
                model._todos.push({ text, isDone: false, isDeleted: false });
            }
        }
    ],
    reactors: [
        model => () => model.activeTodos = model._todos.filter(t => !t.isDone && !t.isDeleted),
        model => () => model.completedTodos = model._todos.filter(t => t.isDone && !t.isDeleted),
        model => () => model.itemsLeft = model._todos.filter(t => !t.isDone && !t.isDeleted).length,
        model => () => model._todos.forEach(t => t.isDeleted = t.isDeleted === undefined ? false : t.isDeleted) 
    ]
})

const [start, completeIntent, deleteIntent, clearIntent, createTodoIntent] = intents

start()