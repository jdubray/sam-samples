
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
 
        const label = '<label ondblclick="JavaScript:return actions.'+intents['edit']+'({\'id\':\''+todo.id+'\'});">'+todo.name+'</label>\n' ;

        // if the item is in edit mode we return an input field instead 
        const input = ('<input  id="edit-todo" class="new-todo"\n\
                        onchange="JavaScript:return actions.'+intents['save']+'({\'id\':\''+todo.id+'\',\'name\':document.getElementById(\'edit-todo\').value});" \n\
                        value="'+todo.name+'"  autofocus></input>') ;
         
        return ('\n\
                        <li '+(checked ? 'class="completed"' : '')+'>\n\
                            <div class="view">\n\
                                <input class="toggle" type="checkbox" '+(checked ? 'checked' : '')+' \n\
                                        onclick="JavaScript:return actions.'+intents['done']+'({\'id\':\''+todo.id+'\'});">\n\
                                '+(todo.edited ? input : label)+'\n\
                                <button class="destroy" onclick="JavaScript:return actions.'+intents['delete']+'({\'id\':\''+todo.id+'\'});"></button>\n\
                            </div>\n\
                            <input class="edit" value="'+todo.description+'">\n\
                        </li>\n') ;
    }) ;

    var showToggleCheckbox = false ;
    const toggleCheckbox = '\
                <input class="toggle-all" type="checkbox" onclick="JavaScript:return actions.'+intents['toggleAll']+'({});">\n\
                <label for="toggle-all">Mark all as complete</label>\n' ;

    todos.forEach(function(item) {
        item.deleted = item.deleted || false ;
        if (!item.deleted) {
            showToggleCheckbox = true ;
        }
    })

    return ( (showToggleCheckbox ? toggleCheckbox : '') +
            '<ul class="todo-list" id="todo-list">'
                +items.join('\n')
           +'</ul>') ;    

} ;

// Component 2: Filters /////////////////////////////////////////// 

theme.filters = (displayActive,displayCompleted,count,completedCount,intents) => {
    const displaySelectedClass = (displayActive && displayCompleted) ? 'class="selected" ' : '';
    const displayActiveClass = (displayActive && !displayCompleted) ? 'class="selected" ' : '';
    const displayCompletedClass = (!displayActive && displayCompleted) ? 'class="selected" ' : '';

    const clearCompleted = ('\n\
                <!-- Hidden if no completed items are left   -->\n\
                <button class="clear-completed" onclick="JavaScript:return actions.'+intents['delete']+'({});">Clear completed</button>') ;

    return ('\n\
        <!-- This should be `0 items left` by default -->\n\
        <span class="todo-count"><strong>'+count+'</strong> item left</span>\n\
        <ul class="filters">\n\
            <li>\n\
                <a '+displaySelectedClass+'href="#/" onclick="JavaScript:return actions.'+intents['displayAll']+'({});">All</a>\n\
            </li>\n\
            <li>\n\
                <a '+displayActiveClass+'href="#/active" onclick="JavaScript:return actions.'+intents['displayActive']+'({});">Active</a>\n\
            </li>\n\
            <li>\n\
                <a '+displayCompletedClass+'href="#/completed" onclick="JavaScript:return actions.'+intents['displayCompleted']+'({});">Completed</a>\n\
            </li>\n\
        </ul>\n' + 
        ((completedCount > 0) ? clearCompleted : '' )
        ) ;
} ;

export { theme } 