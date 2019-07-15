//////////////////////////////////////////////////////////////////////
// Theme
//
// A theme is a series of View components, each component is a mini 
// code generator that generates HTML fragments from properties of 
// the model following the expression:
// C = f(M.part)

import { html } from 'https://unpkg.com/lit-html@1.1.1/lit-html.js';

export default function(intents) {

    // Add intents to the global scope
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

    // Theme Component 1: Item list ///////////////////////////////////////////

    const todoList = ({ items, displayActive, displayCompleted }, { toggleAll = 'toggleAll', save = 'save', edit = 'edit', done = 'done', del = 'del' } = {}) => {

        // generate the item list
        let todoList = items.map(function (todo) {

            const deleted = todo.deleted || false;
            const checked = todo.checked || false;

            if ((deleted) || (!displayActive && !checked) || (!displayCompleted && checked)) { return '' }

            const label = html`<label @dblclick=${() => {
                window.edit({ id : todo.id })}}>${todo.name}</label>`;

            // if the item is in edit mode we return an input field instead 
            const input = html`<input  id="edit-todo" class="new-todo"
                            @change=${() => window.save({ id: todo.id, name:document.getElementById('edit-todo').value })}
                            value="${todo.name}"  autofocus/>`;

            return html`
                    <li class=${(checked ? 'completed' : '')}>
                        <div class="view">
                            <input class="toggle" type="checkbox" ?checked=${checked} 
                                    @click=${(e) => window.done({ id : todo.id })}>
                            ${(todo.edited ? input : label)}
                            <button class="destroy" @click=${() => window.del({ id: todo.id })}></button>
                        </div>
                        <input class="edit" value="${todo.description}">
                    </li>` ;
        });

        let showToggleCheckbox = false;
        const toggleCheckbox = ''
                html`
                    <input class="toggle-all" type="checkbox" @click=${() => window.toggleAll({})}>
                    <label for="toggle-all">Mark all as complete</label>` ;

        items.forEach(function (item) {
            item.deleted = item.deleted || false;
            if (!item.deleted) {
                showToggleCheckbox = true;
            }
        })

        return html`${(showToggleCheckbox ? toggleCheckbox : '')}
                <ul class="todo-list" id="todo-list">
                    ${todoList}
                </ul>` ;

    }

    // Theme Component 2: Filters /////////////////////////////////////////// 

    const todoFilters = ({ displayActive, displayCompleted, count, completedCount }, {
        del = 'del', displayAll = 'displayAll', displayActiveIntent = 'displayActive', displayCompletedIntent = 'displayCompleted'
    } = {}) => {
        const displaySelectedClass = (displayActive && displayCompleted) ? 'selected' : ''
        const displayActiveClass = (displayActive && !displayCompleted) ? 'selected' : ''
        const displayCompletedClass = (!displayActive && displayCompleted) ? 'selected' : ''

        const clearCompleted = html`
                    <!-- Hidden if no completed items are left   -->
                    <button class="clear-completed" @click=${() => window.del({})}>Clear completed</button>
                    `

        return (html`
            <!-- This should be 0 items left by default -->
            <span class="todo-count"><strong>${count}</strong> item left</span>
            <ul class="filters">
                <li>
                    <a class=${displaySelectedClass} href="#/" @click=${() => window.displayAll({})}>All</a>
                </li>
                <li>
                    <a class=${displayActiveClass} href="#/active" @click=${() => window.displayActive({})}>Active</a>
                </li>
                <li>
                    <a class=${displayCompletedClass} href="#/completed" @click=${() => window.displayCompleted({})}>Completed</a>
                </li>
            </ul>
            ${((completedCount > 0) ? clearCompleted : '')}`
        )
    }


    const todoHeader = (save = 'save') => {
        return html`<h1>todos</h1>
                    <input     id="new-todo"  class="new-todo" 
                        @change=${(e) => {
                            window.save({ name: e.srcElement.value })
                            e.srcElement.value = ''
                        }}
                        placeholder="What needs to be done?" autofocus />`
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