
//////////////////////////////////////////////////////////////////////
// Theme
//
// A theme is a series of View components, each component is a mini 
// code generator that generates HTML fragments from properties of 
// the model following the expression:
// C = f(M.part)

var theme = { } ;

// Component 1: Item list ///////////////////////////////////////////

theme.list = (todos, displayActive, displayCompleted, intents) => {

    // generate the item list
    var items = todos.map( function(todo) {

        const deleted = todo.deleted || false ;
        const checked = todo.checked || false ;

        if ((deleted) || (!displayActive && !checked) || (!displayCompleted && checked)) { return '' ; }
 
        const label = `<label ondblclick="JavaScript:return actions.${intents['edit']}({\'id\':\'${todo.id}\'});">${todo.name}</label>` ;

        // if the item is in edit mode we return an input field instead 
        const input = `<input  id="edit-todo" class="new-todo"
                        onchange="JavaScript:return actions.${intents['save']}({\'id\':\'${todo.id}\',\'name\':document.getElementById(\'edit-todo\').value});"
                        value="${todo.name}"  autofocus></input>` ;
         
        return `
                        <li ${(checked ? 'class="completed"' : '')}>
                            <div class="view">
                                <input class="toggle" type="checkbox" ${(checked ? 'checked' : '')} 
                                        onclick="JavaScript:return actions.${intents['done']}({\'id\':\'${todo.id}\'});">
                                ${(todo.edited ? input : label)}
                                <button class="destroy" onclick="JavaScript:return actions.${intents['delete']}({\'id\':\'${todo.id}\'});"></button>
                            </div>
                            <input class="edit" value="${todo.description}">
                        </li>` ;
    }) ;

    var showToggleCheckbox = false ;
    const toggleCheckbox = `
                <input class="toggle-all" type="checkbox" onclick="JavaScript:return actions.${intents['toggleAll']}({});">
                <label for="toggle-all">Mark all as complete</label>` ;

    todos.forEach(function(item) {
        item.deleted = item.deleted || false ;
        if (!item.deleted) {
            showToggleCheckbox = true ;
        }
    })

    return  `${(showToggleCheckbox ? toggleCheckbox : '')}
             <ul class="todo-list" id="todo-list">
                ${items.join('\n')}
             </ul>` ;    

} ;

// Component 2: Filters /////////////////////////////////////////// 

theme.filters = (displayActive,displayCompleted,count,completedCount,intents) => {
    const displaySelectedClass = (displayActive && displayCompleted) ? 'class="selected" ' : '';
    const displayActiveClass = (displayActive && !displayCompleted) ? 'class="selected" ' : '';
    const displayCompletedClass = (!displayActive && displayCompleted) ? 'class="selected" ' : '';

    const clearCompleted = `
                <!-- Hidden if no completed items are left   -->
                <button class="clear-completed" onclick="JavaScript:return actions.${intents['delete']}({});">Clear completed</button>
                ` ;

    return (`
        <!-- This should be 0 items left by default -->
        <span class="todo-count"><strong>${count}</strong> item left</span>
        <ul class="filters">
            <li>
                <a ${displaySelectedClass} href="#/" onclick="JavaScript:return actions.${intents['displayAll']}({});">All</a>
            </li>
            <li>
                <a ${displayActiveClass} href="#/active" onclick="JavaScript:return actions.${intents['displayActive']}({});">Active</a>
            </li>
            <li>
                <a ${displayCompletedClass} href="#/completed" onclick="JavaScript:return actions.${intents['displayCompleted']}({});">Completed</a>
            </li>
        </ul>
        ${((completedCount > 0) ? clearCompleted : '' )}`
        ) ;
} ;

export { theme } 