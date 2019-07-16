import React, { useState } from 'react';
import '../../node_modules/todomvc-common/base.css'
import '../../node_modules/todomvc-common/base.css'

export let TodoApp = () => {
    return (<div/>)
}

export function TodoAppFactory(intents, initialState) {
    let todos, setTodos
        
    const [edit, save, done, displayAll, displayActive, displayCompleted, toggleAll, del] = intents

    TodoApp = function () {
        [todos, setTodos] = useState(initialState)
        
        function handleKeyDown(e, id) {
            if (e.key === 'Enter') {
              save({ id, name: e.target.value });
              if (id === undefined) {
                  e.target.value = ''
              }
            }
            if (e.key === 'Backspace' && id !== undefined && todos.items[id].name === '') {
              e.preventDefault();
              return del({ deleteId: id });
            }
        }

        const Filters = ({ todos }) => {
            const displaySelectedClass = (todos.displayActive && todos.displayCompleted) ? 'selected' : ''
            const displayActiveClass = (todos.displayActive && !todos.displayCompleted) ? 'selected' : ''
            const displayCompletedClass = (!todos.displayActive && todos.displayCompleted) ? 'selected' : ''
            return (
                <ul className="filters">
                    <li>
                        <a className={displaySelectedClass} href="#/" onClick={(e) => {
                                e.preventDefault();
                                displayAll({})
                            }}>All</a>
                    </li>
                    <li>
                        <a className={displayActiveClass} href="#/active" onClick={(e) => {
                                e.preventDefault();
                                displayActive({})}}>Active</a>
                    </li>
                    <li>
                        <a className={displayCompletedClass} href="#/completed" onClick={(e) => {
                                e.preventDefault();
                                displayCompleted({})}}>Completed</a>
                    </li>
                </ul>
            )
        }
        const ClearCompleted = ({ completedCount }) => {
            if (completedCount > 0) {
                return (
                    <button className="clear-completed" 
                        onClick={(e) => {
                            e.preventDefault()
                            del({})
                        }}
                    >Clear completed</button>
                )
            }
            return (
                <div></div>
            )
        }

        const TodoList = ({ items, displayActive, displayCompleted }) => {
            return items.map((todo) => {

                const deleted = todo.deleted || false;
                const checked = todo.checked || false;

                if ((deleted) || (!displayActive && !checked) || (!displayCompleted && checked)) { return (<div className="dontdisplay"></div>) }

                const Label = ({ todo }) => {
                   return (
                    <label onDoubleClick={(e) => {
                        e.preventDefault()
                        edit({ id : todo.id })
                    }}>{todo.name}</label>
                   )
                }

                // if the item is in edit mode we return an input field instead 
                const Input =({ todo }) => {
                    return (
                        <input  id="edit-todo" className="new-todo"
                                onKeyDown={e => handleKeyDown(e, todo.id)} 
                                defaultValue={todo.name}  autofocus/>
                    )
                }

                const InputOrLabel = ({ todo }) => {
                    if (todo.edited) {
                        return (
                            <Input todo={todo} />
                        )   
                    } 
                    return (
                        <Label todo={todo} />
                    )
                }
                    
                return (
                    <li className={(todo.checked ? 'completed' : '')} key={todo.id}>
                        <div className="view">
                            <input className="toggle" type="checkbox" defaultChecked={todo.checked} 
                                    onClick={(e) => {
                                        e.preventDefault()
                                        done({ id : todo.id })
                                    }} />
                            <InputOrLabel todo={todo}/>
                            <button className="destroy" 
                                onClick={(e) => {
                                    e.preventDefault()
                                    del({ id: todo.id })
                                }}
                            ></button>
                        </div>
                    </li>
                )
            })
        }
        
        return (
            <div>
            <header className="header">
                <h1>todos</h1>
                <input className="new-todo"
                    id="new-todo"  
                    onKeyDown={e => handleKeyDown(e)} 
                    placeholder="What needs to be done?" 
                    autoFocus
                />
            </header>

            <section className="main">
                <ul className="todo-list">
                    <TodoList items={todos.items} displayActive={todos.displayActive} displayCompleted={todos.displayCompleted} />
                </ul>
            </section>

            <footer className="footer">
                <div id="filters">
                    <span className="todo-count"><strong>{todos.count}</strong> item left</span>
                    <Filters todos={todos} />
                    <ClearCompleted clearCompleted={todos.completedCount} />
                </div>
            </footer>
        </div>
        );
    }

    // Return render hook
    return [state => {
        setTodos(state)
    }]
}