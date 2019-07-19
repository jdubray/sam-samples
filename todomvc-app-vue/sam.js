const { addInitialState, addComponent, setRender, on } = tp;

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
});

const { intents, state } = addComponent({
    actions:[
        () => ({}),
        todo => ({ complete: todo }),
        todo => ({ del: todo }),
        () => ({ clear: true }),
        event => ({ text: event.target.value }),
        todo => ({ startEditing: todo }),
        () => ({ finishEditing: true }),
        todo => ({ cancelEditing: todo })
    ],
    acceptors:[
        model => ({ complete, del, clear }) => 
            on(complete, () => complete.isDone = !complete.isDone )
                .on(del, () => del.isDeleted = true)
                .on(clear, () => model.completedTodos.forEach(t => t.isDeleted = true)),
        
        model => ({ text, startEditing, finishEditing, cancelEditing }) => 
            on(text, () =>
                model._todos.push({ text, isDone: false, isDeleted: false }))
                .on(startEditing, () => {
                    model._editingTodo = startEditing;
                    model._beforeText = startEditing.text;
                })
                .on(finishEditing, () => {
                    model._editingTodo = null;
                    model._beforeText = '';
                })
                .on(cancelEditing, () => {
                    model._editingTodo = null;
                    cancelEditing.text = model._beforeText;
                })
    ],
    reactors: [
        model => () => model.activeTodos = model._todos.filter(t => !t.isDone && !t.isDeleted),
        model => () => model.completedTodos = model._todos.filter(t => t.isDone && !t.isDeleted),
        model => () => model.itemsLeft = model._todos.filter(t => !t.isDone && !t.isDeleted).length,
        model => () => model._todos.forEach(t => t.isDeleted = t.isDeleted === undefined ? false : t.isDeleted),
        model => () => model.editingTodo = model._editingTodo,
        model => () => model.beforeText = model._beforeText,
        model => () => model._todos = model._todos.filter(todo => !todo.isDeleted)
    ]
});

const [start, completeIntent, deleteIntent, clearIntent, createTodoIntent, startEditingIntent, finishEditingIntent, cancelEditingIntent] = intents;

start();