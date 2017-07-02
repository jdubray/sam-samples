

//////////////////////////////////////////////////////////////////////
// Theme
//
// A theme is a series of View components, each component is a mini 
// code generator that generates HTML fragments from properties of 
// the model following the expression:
// C = f(M.part)

var theme = {};

// Component 1: Item list ///////////////////////////////////////////

theme.list = (todos, displayActive, displayCompleted, intents) => {

	// generate the item list
	const items = todos.map(function (todo) {

		const deleted = todo.deleted || false;
		const checked = todo.checked || false;

		if ((deleted) || (!displayActive && !checked) || (!displayCompleted && checked)) { return ''; }

		const label = '<label ondblclick="return ' + intents['edit'] + '({\'id\':\'' + todo.id + '\'});">' + todo.name + '</label>\n';

		// if the item is in edit mode we return an input field instead 
		const input = ('<input  id="edit-todo" class="new-todo"\n\
						onchange="return '+ intents['save'] + '({\'id\':\'' + todo.id + '\',\'name\':document.getElementById(\'edit-todo\').value});" \n\
						value="'+ todo.name + '"  autofocus></input>');

		return ('\n\
				<li '+ (checked ? 'class="completed"' : '') + '>\n\
					<div class="view">\n\
						<input class="toggle" type="checkbox" '+ (checked ? 'checked' : '') + ' \n\
								onclick="return '+ intents['done'] + '({\'id\':\'' + todo.id + '\'});">\n\
						'+ (todo.edited ? input : label) + '\n\
						<button class="destroy" onclick="return '+ intents['delete'] + '({\'id\':\'' + todo.id + '\'});"></button>\n\
					</div>\n\
					<input class="edit" value="'+ todo.description + '">\n\
				</li>\n');
	});

	var showToggleCheckbox = false;
	const toggleCheckbox = '\
				<input class="toggle-all" type="checkbox" onclick="return '+ intents['toggleAll'] + '({});">\n\
				<label for="toggle-all">Mark all as complete</label>\n' ;

	todos.forEach(function (item) {
		item.deleted = item.deleted || false;
		if (!item.deleted) {
			showToggleCheckbox = true;
		}
	})

	return ((showToggleCheckbox ? toggleCheckbox : '') +
		'<ul class="todo-list" id="todo-list">'
		+ items.join('\n')
		+ '</ul>');

};

// Component 2: Filters /////////////////////////////////////////// 

theme.filters = (displayActive, displayCompleted, count, completedCount, intents) => {
	const displaySelectedClass = (displayActive && displayCompleted) ? 'class="selected" ' : '';
	const displayActiveClass = (displayActive && !displayCompleted) ? 'class="selected" ' : '';
	const displayCompletedClass = (!displayActive && displayCompleted) ? 'class="selected" ' : '';

	const clearCompleted = ('\n\
				<!-- Hidden if no completed items are left   -->\n\
				<button class="clear-completed" onclick="JavaScript:return '+ intents['delete'] + '({});">Clear completed</button>');

	return ('\n\
		<!-- This should be `0 items left` by default -->\n\
		<span class="todo-count"><strong>'+ count + '</strong> item left</span>\n\
		<ul class="filters">\n\
			<li>\n\
				<a '+ displaySelectedClass + 'href="#/" onclick="return ' + intents['displayAll'] + '({});">All</a>\n\
			</li>\n\
			<li>\n\
				<a '+ displayActiveClass + 'href="#/active" onclick="return ' + intents['displayActive'] + '({});">Active</a>\n\
			</li>\n\
			<li>\n\
				<a '+ displayCompletedClass + 'href="#/completed" onclick="return ' + intents['displayCompleted'] + '({});">Completed</a>\n\
			</li>\n\
		</ul>\n' +
		((completedCount > 0) ? clearCompleted : '')
	);
};

theme.header = (intents) => '<h1>todos</h1>\n\
<input     id="new-todo"  class="new-todo"\n\
        onchange="return '+ intents['save'] + '({\'name\':document.getElementById(\'new-todo\').value});"\n\
        placeholder="What needs to be done?" autofocus></input>' ;


//////////////////////////////////////////////////////////////////////
//  Model
// 

// Initialize the model 

var model = {
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


model.presentFilters = (data) => {
	// filter settings
	if (data.displayCompleted !== undefined) { model.displayCompleted = data.displayCompleted; }
	if (data.displayActive !== undefined) { model.displayActive = data.displayActive; }

};

model.CRUD = (data) => {
	// CRUD
	// Toggle All
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


model.postProcessing = () => {

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
	state.render(model);
};

model.state = state;

////////////////////////////////////////////////////////////////////////////////
// View
//
var view = {};

// Initial State
view.init = (model, intents) => {
	return view.ready(model, intents);
};

// State representation of the ready state
view.ready = (model, intents) => {

	// generate the representation of each component
	return ({
		todoHeader: theme.header(intents),
		todoList: theme.list(model.items, model.displayActive, model.displayCompleted, intents),
		filters: theme.filters(model.displayActive, model.displayCompleted, model.count, model.completedCount, intents)
	});
};


//display the state representation
view.display = (representation) => {

	// mount each component in the corresponding div
	Object.keys(representation).forEach(function (el) {
		const component = document.getElementById(el);
		component.innerHTML = representation[el];
	});

	// clean up edited field
	const inputField = document.getElementById('new-todo');
	inputField.value = '';
};


////////////////////////////////////////////////////////////////////////////////
// State
//
var state = { view: view };

// Derive the state representation as a function of the systen
// control state
state.representation = (model) => {
	var representation = 'oops... something went wrong, the system is in an invalid state';

	// This is where the State decides which component of the View should be displayed
	// here the we designed the application with a single (control) State (~page)
	// In a real-world application there would be many control states and which
	// would trigger the display of different components    
	if (state.ready(model)) {
		representation = state.view.ready(model, actions.intents);
	}

	// complete the reactive loop
	state.view.display(representation);
};

// Derive the current state of the system
state.ready = function (model) {
	return true;
};



// Next action predicate, derives whether
// the system is in a (control) state where
// a new (next) action needs to be invoked

state.nextAction = (model) => { };

state.render = (model) => {
	state.representation(model)
	state.nextAction(model);
};


////////////////////////////////////////////////////////////////////////////////
// Actions
//

var actions = {};

actions.present = model.present;

// Intents enable a further decoupling between 
// the view components and the actions
actions.intents = {
	edit: 'actions.edit',
	save: 'actions.save',
	done: 'actions.done',
	displayAll: 'actions.displayAll',
	displayActive: 'actions.displayActive',
	displayCompleted: 'actions.displayCompleted',
	toggleAll: 'actions.toggleAll',
	delete: 'actions.delete'

};

actions.edit = (data, present) => {
	present = present || actions.present;
	data = { editItemId: data.id };
	// next step of the reactive loop: present values to the model        
	present(data);
	return false;
};

actions.save = (data, present) => {
	present = present || actions.present;
	data.item = { name: data.name, description: data.description, id: data.id || null };
	// next step of the reactive loop: present values to the model        
	present(data);
	return false;
};

actions.done = (data, present) => {
	present = present || actions.present;
	data = { selectItemId: data.id };
	// next step of the reactive loop: present values to the model        
	present(data);
	return false;
};

actions.displayAll = (data, present) => {
	present = present || actions.present;
	data = { displayCompleted: true, displayActive: true };
	// next step of the reactive loop: present values to the model        
	present(data);
	return false;
};

actions.displayActive = (data, present) => {
	present = present || actions.present;
	data = { displayCompleted: false, displayActive: true };
	// next step of the reactive loop: present values to the model        
	present(data);
	return false;
};

actions.displayCompleted = (data, present) => {
	present = present || actions.present;
	data = { displayCompleted: true, displayActive: false };
	// next step of the reactive loop: present values to the model        
	present(data);
	return false;
};

actions.toggleAll = (data, present) => {
	present = present || actions.present;
	data = { toggleAll: true };
	// next step of the reactive loop: present values to the model        
	present(data);
	return false;
};

actions.delete = (data, present) => {
	present = present || actions.present;
	data.id = data.id || -1;
	data = { deletedItemId: data.id };
	// next step of the reactive loop: present values to the model        
	present(data);
	return false;
};


(function (window) {

	'use strict';

	// Display initial state representation

	state.render(model);

})(window);
