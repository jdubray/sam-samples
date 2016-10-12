////////////////////////////////////////////////////////////////////////////////
// Actions
//

export var todo: any = {} ;

let dispatch = "dispatch({__event:";
let namespace = "todo";

function applyDispath(action: string,ns?:string):any {
    ns = ns || namespace ;
    if (dispatch) {
        action = dispatch+`'${ns}.${action}'`
    } else {
        action = `actions.${action}`;
    }
    return  action;
}

todo.init = (present) => {
     todo.present = present ;
} ;

// Intents enable a further decoupling between 
// the view components and the actions
todo.intents = {
    edit: applyDispath("edit"),
    save: applyDispath("save"),
    done: applyDispath("done"),
    displayAll: applyDispath("displayAll"),
    displayActive: applyDispath("displayActive"),
    displayCompleted: applyDispath("displayCompleted"),
    toggleAll: applyDispath("toggleAll"),
    delete: applyDispath("delete")

} ;

todo.edit = (data, present) => {
    present = present || todo.present ;
    data = {editItemId: data.id} ;
    // next step of the reactive loop: present values to the model        
    present(data) ;
    return false ;
} ;

todo.save = (data, present) => {
    present = present || todo.present ;
    data.item = {text: data.text, id: data.id || null} ;
    // next step of the reactive loop: present values to the model        
    present(data) ;
    return false ;
} ;

todo.done = (data, present) => {
    present = present || todo.present ;
    data = {selectItemId: data.id} ;
    // next step of the reactive loop: present values to the model        
    present(data) ;
    return false ;
} ;

todo.displayAll = (data, present) => {
    present = present || todo.present ;
    data = {displayCompleted: true, displayActive: true} ;
    // next step of the reactive loop: present values to the model        
    present(data) ;
    return false ;
} ;

todo.displayActive = (data, present) => {
    present = present || todo.present ;
    data = {displayCompleted: false, displayActive: true} ;
    // next step of the reactive loop: present values to the model        
    present(data) ;
    return false ;
} ;

todo.displayCompleted = (data, present) => {
    present = present || todo.present ;
    data = {displayCompleted: true, displayActive: false} ;
    // next step of the reactive loop: present values to the model        
    present(data) ;
    return false ;
} ;

todo.toggleAll = (data, present) => {
    present = present || todo.present ;
    data = {toggleAll: true} ;
    // next step of the reactive loop: present values to the model        
    present(data) ;
    return false ;
} ;

todo.delete = (data, present) => {
    present = present || todo.present ;
    if (data.id !== 0) { data.id = data.id || -1 ; }
    data = {deletedItemId: data.id} ;
    // next step of the reactive loop: present values to the model        
    present(data) ;
    return false ;
} ;