

export var todo = function(model,proposal){

    model.todo = model.todo || {} ;

    if (proposal.toggleAll) {
        model.todo.todoList.forEach(function(el,index) {
            model.todo.todoList[index].checked = !model.todo.todoList[index].checked ;
        }) ;
    }

    // switch item to edit mode
    if (proposal.editItemId !== undefined) { 
        
        model.todo.todoList.forEach(function(el,index) {
            if (el.id !== undefined) {
                if (el.id == proposal.editItemId) {
                    model.todo.todoList[index].edited = true ;      
                } else {
                    model.todo.todoList[index].edited = false ; 
                }
            }
        });

    }

    // complete item
    if (proposal.selectItemId !== undefined) {
        
        model.todo.todoList.forEach(function(el,index) {
            if (el.id !== undefined) {
                if (el.id == proposal.selectItemId) {
                    model.todo.lastEdited = model.todo.todoList[index] ;
                    model.todo.todoList[index].checked = true ;       
                }
            }
        });

    }

    // delete completed item(s)
    if (proposal.deletedItemId !== undefined) {
        if (proposal.deletedItemId < 0) {
            // delete all completed items
            model.todo.todoList.forEach(function(el,index) {
                model.todo.todoList[index].deleted = model.todo.todoList[index].deleted || model.todo.todoList[index].checked ;
            });
        } else {
            // delete spectific item
            model.todo.todoList.forEach(function(todo,index) {
                if (todo.id !== undefined) {
                    if (todo.id == proposal.deletedItemId) {
                        model.todo.lastDeleted = model.todo.todoList[index] ;
                        model.todo.todoList[index].deleted = true ;      
                    }
                }
            });
        }
    }

    if (proposal.lastEdited !== undefined) {
        model.todo.lastEdited = proposal.lastEdited ;
    } else {
        delete model.todo.lastEdited ;
    } 
    
    if (proposal.item !== undefined) {
        if (proposal.item.id !== null) {
            // item has been edited
            model.todo.todoList.forEach(function(el,index) {
                if (el.id !== undefined) {
                    if (el.id == proposal.item.id) {
                        model.todo.todoList[index] = proposal.item ;   
                        model.todo.todoList[index].edited = false ;     
                    }
                }
            });
            
        } else {
            // new item
            proposal.item.id = model.itemId++ ;
            model.todo.todoList.push(proposal.item) ;
        }
    }



    // perform ancillary assignments
    model.todo.count = 0 ;
    model.todo.completedCount = 0 ;
    model.todo.todoList.forEach(function(item) {
        if (!item.checked && !item.deleted) {
            model.todo.count += 1 ;
        }
        if (item.checked && !item.deleted) {
            model.todo.completedCount += 1 ;
        }
    }) ;


} ;
