// 

// let dispatch = "dispatch({__event:";
// let namespace = "todo";

// function applyDispath(action: string,ns?:string):any {
//     ns = ns || namespace ;
//     if (dispatch) {
//         action = dispatch+`'${ns}.${action}'`
//     } else {
//         action = `actions.${action}`;
//     }
//     return  action;
// }

// todo.init = (present) => {
//      todo.present = present ;
// } ;

// // Intents enable a further decoupling between 
// // the view components and the actions
// todo.intents = {
//     edit: applyDispath("edit"),
//     save: applyDispath("save"),
//     done: applyDispath("done"),
//     displayAll: applyDispath("displayAll"),
//     displayActive: applyDispath("displayActive"),
//     displayCompleted: applyDispath("displayCompleted"),
//     toggleAll: applyDispath("toggleAll"),
//     delete: applyDispath("delete")

// } ;

// todo.edit = (data, present) => {
//     present = present || todo.present ;
//     data = {editItemId: data.id} ;
//     // next step of the reactive loop: present values to the model        
//     present(data) ;
//     return false ;
// } ;

// todo.save = (data, present) => {
//     present = present || todo.present ;
//     data.item = {text: data.text, id: data.id || null} ;
//     // next step of the reactive loop: present values to the model        
//     present(data) ;
//     return false ;
// } ;

// todo.done = (data, present) => {
//     present = present || todo.present ;
//     data = {selectItemId: data.id} ;
//     // next step of the reactive loop: present values to the model        
//     present(data) ;
//     return false ;
// } ;

// todo.displayAll = (data, present) => {
//     present = present || todo.present ;
//     data = {displayCompleted: true, displayActive: true} ;
//     // next step of the reactive loop: present values to the model        
//     present(data) ;
//     return false ;
// } ;

// todo.displayActive = (data, present) => {
//     present = present || todo.present ;
//     data = {displayCompleted: false, displayActive: true} ;
//     // next step of the reactive loop: present values to the model        
//     present(data) ;
//     return false ;
// } ;

// todo.displayCompleted = (data, present) => {
//     present = present || todo.present ;
//     data = {displayCompleted: true, displayActive: false} ;
//     // next step of the reactive loop: present values to the model        
//     present(data) ;
//     return false ;
// } ;

// todo.toggleAll = (data, present) => {
//     present = present || todo.present ;
//     data = {toggleAll: true} ;
//     // next step of the reactive loop: present values to the model        
//     present(data) ;
//     return false ;
// } ;

// todo.delete = (data, present) => {
//     present = present || todo.present ;
//     if (data.id !== 0) { data.id = data.id || -1 ; }
//     data = {deletedItemId: data.id} ;
//     // next step of the reactive loop: present values to the model        
//     present(data) ;
//     return false ;
// } ;

let todo = {

    actions: [
        // add item
        { 
            name: "addItem",
            implementation: function(data, present, model) {
                data.__action = 'addItem' ;
                console.log('in action AddItem')
                if (model) { 
                    model.present(data) ;
                } else {
                    present(data) ;
                }
                return false ;
            }
        },
        // edit item save

        // edit item cancel

        // remove item
        { 
            name: "removeItem",
            implementation: function(data, present, model) {
                data.__action = 'removeItem' ;
                console.log('in action removeItem')
                if (model) { 
                    model.present(data) ;
                } else {
                    present(data) ;
                }
                return false ;
            }
        },
        // remove completed item
        { 
            name: "clearCompleted",
            implementation: function(data, present, model) {
                data.__action = 'clearCompleted' ;
                console.log('in action clearCompleted')
                if (model) { 
                    model.present(data) ;
                } else {
                    present(data) ;
                }
                return false ;
            }
        },

        // toggle completed
        // togger all
        { 
            name: "display",
            implementation: function(data, present, model) {
                data.__action = 'display' ;
                console.log('in action display')
                if (model) { 
                    model.present(data) ;
                } else {
                    present(data) ;
                }
                return false ;
            }
        },

        // toggle item

        { 
            name: "toggleItem",
            implementation: function(data, present, model) {
                data.__action = 'toggleItem' ;
                console.log('in action toggleItem')
                if (model) { 
                    model.present(data) ;
                } else {
                    present(data) ;
                }
                return false ;
            }
        }
    ],

    acceptors: [
        
        // add item
        { 
            name: "addItem",
            order: 0,
            update: function(model,data) {
                if (data.title) {
                    model.home.items.push({title: data.title})
                }
            }
        },

        // edit item save

        // edit item cancel

        // remove item
        { 
            name: "removeItem",
            order: 0,
            update: function(model,data) {
                if (data.removedItem !== undefined) {
                    model.home.items  = model.home.items.map( (item, index) => (index == data.removedItem) ? null : item).filter( value => value != null)
                }
            }
        },

        // remove completed item
        { 
            name: "newItemSet",
            order: 0,
            update: function(model,data) {
                if (data.newItems !== undefined) {
                    model.home.items  = data.newItems
                }
            }
        },

        // toggle completed
        // togger all
        { 
            name: "display",
            order: 0,
            update: function(model,data) {
                if (data.filter !== undefined) {
                    model.home.filter  = data.filter
                }
            }
        },

        // toggle item

        { 
            name: "toggleItem",
            order: 0,
            update: function(model,data) {
                if (data.toggleItem !== undefined) {
                    model.home.items.forEach( function(item, index) {
                        if (index == data.toggleItem) {
                            item.completed = !(item.completed)
                        }
                    })
                }
            }
        }


    ],

    reactors: [
        // count the number of todo(s) left
        { 
            name: "countOpenItems",
            order: 0,
            compute: function(model) {
                model.home.openItems = model.home.items.map( item => item.completed ? 0 : 1).reduce( (a,b) => a + b)
            }
        }
    ]
}

export { todo }