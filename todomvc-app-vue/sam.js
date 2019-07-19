const { addInitialState, addComponent, setRender } = tp;

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
        },
        model => ({ startEditing }) => {
            if (startEditing) {
                model._editingTodo = startEditing;
                model._beforeText = startEditing.text;
            }
        },
        model => ({ finishEditing }) => {
            if (finishEditing) {
                model._editingTodo = null;
                model._beforeText = '';
            }
        },
        model => ({ cancelEditing }) => {
            if (cancelEditing) {
                model._editingTodo = null;
                cancelEditing.text = model._beforeText;
            }
        }
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