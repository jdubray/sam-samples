//////////////////////////////////////////////////////////////////////
// Theme
//
// A theme is a series of View components, each component is a mini 
// code generator that generates HTML fragments from properties of 
// the model following the expression:
// C = f(M.part)

export default function(intents) {

    Object.assign(window, {
        edit: intents[0],
        save: intents[1],
        done: intents[2],
        displayAll: intents[3],
        displayActive: intents[4],
        displayCompleted: intents[5],
        toggleAll: intents[6],
        del: intents[7]
    })

    // Component 1: Item list ///////////////////////////////////////////

    const todoList = ({ items, displayActive, displayCompleted }, { toggleAll = 'toggleAll', save = 'save', edit = 'edit', done = 'done', del = 'del' } = {}) => {

        // generate the item list
        let todoList = items.map(function (todo) {

            const deleted = todo.deleted || false;
            const checked = todo.checked || false;

            if ((deleted) || (!displayActive && !checked) || (!displayCompleted && checked)) { return '' }

            const label = `<label ondblclick="return ${edit}({'id':'${todo.id}'});">${todo.name}</label>`;

            // if the item is in edit mode we return an input field instead 
            const input = `<input  id="edit-todo" class="new-todo"
                            onchange="return ${save}({'id':'${todo.id}','name':document.getElementById('edit-todo').value});"
                            value="${todo.name}"  autofocus></input>`;

            return `
                    <li ${(checked ? 'class="completed"' : '')}>
                        <div class="view">
                            <input class="toggle" type="checkbox" ${(checked ? 'checked' : '')} 
                                    onclick="return ${done}({'id':'${todo.id}'});">
                            ${(todo.edited ? input : label)}
                            <button class="destroy" onclick="return ${del}({'id':'${todo.id}'});"></button>
                        </div>
                        <input class="edit" value="${todo.description}">
                    </li>` ;
        });

        let showToggleCheckbox = false;
        const toggleCheckbox = `
                    <input class="toggle-all" type="checkbox" onclick="return ${toggleAll}({});">
                    <label for="toggle-all">Mark all as complete</label>` ;

        items.forEach(function (item) {
            item.deleted = item.deleted || false;
            if (!item.deleted) {
                showToggleCheckbox = true;
            }
        })

        return `${(showToggleCheckbox ? toggleCheckbox : '')}
                <ul class="todo-list" id="todo-list">
                    ${todoList.join('\n')}
                </ul>` ;

    }

    // Component 2: Filters /////////////////////////////////////////// 

    const todoFilters = ({ displayActive, displayCompleted, count, completedCount }, {
        del = 'del', displayAll = 'displayAll', displayActiveIntent = 'displayActive', displayCompletedIntent = 'displayCompleted'
    } = {}) => {
        const displaySelectedClass = (displayActive && displayCompleted) ? 'class="selected" ' : ''
        const displayActiveClass = (displayActive && !displayCompleted) ? 'class="selected" ' : ''
        const displayCompletedClass = (!displayActive && displayCompleted) ? 'class="selected" ' : ''

        const clearCompleted = `
                    <!-- Hidden if no completed items are left   -->
                    <button class="clear-completed" onclick="return ${del}({});">Clear completed</button>
                    `

        return (`
            <!-- This should be 0 items left by default -->
            <span class="todo-count"><strong>${count}</strong> item left</span>
            <ul class="filters">
                <li>
                    <a ${displaySelectedClass} href="#/" onclick="return ${displayAll}({});">All</a>
                </li>
                <li>
                    <a ${displayActiveClass} href="#/active" onclick="return ${displayActiveIntent}({});">Active</a>
                </li>
                <li>
                    <a ${displayCompletedClass} href="#/completed" onclick="return ${displayCompletedIntent}({});">Completed</a>
                </li>
            </ul>
            ${((completedCount > 0) ? clearCompleted : '')}`
        )
    }


    const todoHeader = (save = 'save') => {
        return `<h1>todos</h1>
                <input     id="new-todo"  class="new-todo"  
                        onchange="return ${save}({'name':document.getElementById('new-todo').value});" 
                        placeholder="What needs to be done?" autofocus></input>`
    }

    const representation = (state) => ({
        todoHeader: todoHeader(),
        todoList: todoList(state),
        filters: todoFilters(state)
    })

    return {
        todoHeader,
        todoFilters,
        todoList,
        representation
    }
}