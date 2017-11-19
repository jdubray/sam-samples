// 

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
                            item.completed = data.checked
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
                model.home.openItems = model.home.items.map( item => item.completed ? 0 : 1).reduce( (a,b) => a + b, 0)
            }
        }
    ]
}

export { todo }