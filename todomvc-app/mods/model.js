//////////////////////////////////////////////////////////////////////
//  Model
// 

// Initialize the model 

export var model = {
    items: [
        {
            id: 1,
            name: "Item 1",
            description: "This is a description",
            edited: false
        },
        {
            id: 2,
            name: "Item 2",
            description: "This is a description",
            edited: false
        }
    ],
    itemId: 3,
    count: 2,
    completedCount: 0,
    displayActive: true,
    displayCompleted: true
};


model.init = (state) => {
    model.state = state;
}

model.presentFilters = (data) => {
    // filter settings
    if (data.displayCompleted !== undefined) { model.displayCompleted = data.displayCompleted; }
    if (data.displayActive !== undefined) { model.displayActive = data.displayActive; }

};

model.CRUD = (data) => {
    // CRUD
    //
    if (data.toggleAll) {
        model.items.forEach(function (el, index) {
            model.items[index].checked = !model.items[index].checked;
        });
    }

    // switch item to edit mode
    if (data.editItemId !== undefined) {

        model.items.forEach(function (el, index) {
            if (el.id !== undefined) {
                if (el.id == data.editItemId) {
                    model.items[index].edited = true;
                } else {
                    model.items[index].edited = false;
                }
            }
        });

    }

    // complete item
    if (data.selectItemId !== undefined) {

        model.items.forEach(function (el, index) {
            if (el.id !== undefined) {
                if (el.id == data.selectItemId) {
                    model.lastEdited = model.items[index];
                    model.items[index].checked = true;
                }
            }
        });

    }

    // delete completed item(s)
    if (data.deletedItemId !== undefined) {
        if (data.deletedItemId < 0) {
            // delete all completed items
            model.items.forEach(function (el, index) {
                model.items[index].deleted = model.items[index].deleted || model.items[index].checked;
            });
        } else {
            // delete spectific item
            model.items.forEach(function (el, index) {
                if (el.id !== undefined) {
                    if (el.id == data.deletedItemId) {
                        model.lastDeleted = model.items[index];
                        model.items[index].deleted = true;
                    }
                }
            });
        }
    }

    if (data.lastEdited !== undefined) {
        model.lastEdited = data.lastEdited;
    } else {
        delete model.lastEdited;
    }

    if (data.item !== undefined) {
        if (data.item.id !== null) {
            // item has been edited
            model.items.forEach(function (el, index) {
                if (el.id !== undefined) {
                    if (el.id == data.item.id) {
                        model.items[index] = data.item;
                        model.items[index].edited = false;
                    }
                }
            });

        } else {
            // new item
            data.item.id = model.itemId++;
            model.items.push(data.item);
        }
    }
};


model.postProcessing = _ => {

    // perform ancillary assignments
    model.count = 0;
    model.completedCount = 0;
    model.items.forEach(function (item) {
        if (!item.checked && !item.deleted) {
            model.count += 1;
        }
        if (item.checked && !item.deleted) {
            model.completedCount += 1;
        }
    });
};

model.present = (data) => {

    data = data || {};

    model.presentFilters(data);

    model.CRUD(data);

    model.postProcessing();

    // next step of the reactive loop: compute the state representation   
    model.state.render(model);
};
