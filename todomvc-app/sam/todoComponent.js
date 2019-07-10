const { utils: { E } } = tp

export default {
    actions: [
        // edit
        (data) => ({ editItemId: data.id }),
        
        // save 
        (data) => {
            data.item = { 
                name: data.name, 
                description: data.description, 
                id: E(data.id) ? data.id : null 
            }
            return data
        },
        
        // done 
        (data) => ({ selectItemId: data.id }),
        
        // displayAll 
        () => ({ displayCompleted: true, displayActive: true }),
        
        // displayActive 
        () => ({ displayCompleted: false, displayActive: true }),
        
        // displayCompleted 
        () => ({ displayCompleted: true, displayActive: false }),
        
        // toggleAll 
        () => ({ toggleAll: true }),
        
        // delete 
        (data) => ({ deletedItemId: E(data.id) ? data.id : -1 })
    ],
    acceptors: [
        // presentFilters 
        (model) => ({ displayCompleted, displayActive}) => {
            if (E(displayCompleted)) model.displayCompleted = displayCompleted
            if (E(displayActive)) model.displayActive = displayActive
        },
        

        // CRUD
        //
        // toggleAll
        (model) => ({ toggleAll }) => {
            if (E(toggleAll)) {
                model.items.forEach(function (item, index) {
                    model.items[index].checked = !item.checked
                })
            }
        },
        
        // switch item to edit mode
        (model) => ({ editItemId }) => {
            if (E(editItemId)) {
                model.items.forEach(function (el, index) {
                    if (E(el.id)) {
                        model.items[index].edited = (el.id == editItemId)
                    }
                })
            }
        },
        

        // complete item
        (model) => ({ selectItemId }) => {
            if (E(selectItemId)) {
                model.items.forEach(function (el, index) {
                    if (E(el.id)) {
                        if (el.id == selectItemId) {
                            model.lastEdited = model.items[index]
                            model.items[index].checked = true
                        }
                    }
                })
            }
        },
        
        // delete completed item(s)
        (model) => ({ deletedItemId }) => {
            if (E(deletedItemId)) {
                if (deletedItemId < 0) {
                    // delete all completed items
                    model.items.forEach(function (el, index) {
                        model.items[index].deleted = model.items[index].deleted || model.items[index].checked
                    });
                } else {
                    // delete spectific item
                    model.items.forEach(function (el, index) {
                        if (E(el.id)) {
                            if (el.id == deletedItemId) {
                                model.lastDeleted = model.items[index]
                                model.items[index].deleted = true
                            }
                        }
                    })
                }
            }
        },
        
        (model) => ({ lastEdited }) => {
            if (E(lastEdited)) {
                model.lastEdited = lastEdited
            } else {
                delete model.lastEdited
            }
        },
        
        (model) => ({ item }) => {
            if (E(item)) {
                if (E(item.id)) {
                    // item has been edited
                    model.items.forEach(function (el, index) {
                        if (E(el.id)) {
                            if (el.id == item.id) {
                                model.items[index] = item
                                model.items[index].edited = false
                            }
                        }
                    })
                } else {
                    // new item
                    item.id = model.itemId++;
                    model.items.push(item);
                }
            }
        }
    ],
    reactors: [
        model => _ => {
            model.count = 0;
            model.completedCount = 0;
            model.items.forEach(function (item) {
                if (!item.checked && !item.deleted) {
                    model.count += 1;
                }
                if (item.checked && !item.deleted) {
                    model.completedCount += 1;
                }
            })
        }
    ]
}