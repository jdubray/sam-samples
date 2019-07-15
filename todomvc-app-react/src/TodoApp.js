import React, { useState } from 'react';
import '../node_modules/todomvc-common/base.css'
import '../node_modules/todomvc-common/base.css'

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
        
          function createTodoAtIndex(e, i) {
            const newTodos = [...todos];
            newTodos.splice(i + 1, 0, {
              content: '',
              isCompleted: false,
            });
            setTodos(newTodos);
            setTimeout(() => {
              document.forms[0].elements[i + 1].focus();
            }, 0);
          }
        
          function updateTodoAtIndex(e, i) {
            const newTodos = [...todos];
            newTodos[i].content = e.target.value;
            setTodos(newTodos);
          }
        
          function removeTodoAtIndex(i) {
            if (i === 0 && todos.length === 1) return;
            setTodos(todos => todos.slice(0, i).concat(todos.slice(i + 1, todos.length)));
            setTimeout(() => {
              document.forms[0].elements[i - 1].focus();
            }, 0);
          }
        
          function toggleTodoCompleteAtIndex(index) {
            const temporaryTodos = [...todos];
            temporaryTodos[index].isCompleted = !temporaryTodos[index].isCompleted;
            setTodos(temporaryTodos);
          }

        //   onChange={(e) => {
        //     e.preventDefault()
        //     save({ name: e.target.value })
        //     // e.srcElement.value = ''
        // }}

        const displaySelectedClass = (todos.displayActive && todos.displayCompleted) ? 'selected' : ''
        const displayActiveClass = (todos.displayActive && !todos.displayCompleted) ? 'selected' : ''
        const displayCompletedClass = (!todos.displayActive && todos.displayCompleted) ? 'selected' : ''

        const ClearCompleted = ({ completedCount }) => {
                    if (completedCount > 0) {
                        return (
                            <button className="clear-completed" onClick={() => window.del({})}>Clear completed</button>
                        )
                    }
                    return (
                        <div></div>
                    )
        }

        const TodoList = ({ items }) => {
            return items.map((todo) => {

                const deleted = todo.deleted || false;
                const checked = todo.checked || false;

                if ((deleted) || (!displayActive && !checked) || (!displayCompleted && checked)) { return '' }

                const Label = ({ todo }) => {
                   return (
                    <label onDoubleClick={() => {
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
                                    onClick={(e) => done({ id : todo.id })} />
                            <InputOrLabel todo={todo}/>
                            <button className="destroy" onClick={() => del({ id: todo.id })}></button>
                        </div>
                        <input className="edit" defaultValue={todo.description} />
                    </li>
                )
            })
        }
        
          return (
            <div className="app">
                <h1>todos</h1>
                <input className="new-todo"
                    id="new-todo"  
                    onKeyDown={e => handleKeyDown(e)} 
                    placeholder="What needs to be done?" 
                    autoFocus
                />

              
              <form className="todo-list">
                <ul>
                  <TodoList items={todos.items} />
                </ul>
              </form>

             
            <span className="todo-count"><strong>{todos.count}</strong> item left</span>
            <ul className="filters">
                <li>
                    <a className={displaySelectedClass} href="#/" onClick={() => displayAll({})}>All</a>
                </li>
                <li>
                    <a className={displayActiveClass} href="#/active" onClick={() => displayActive({})}>Active</a>
                </li>
                <li>
                    <a className={displayCompletedClass} href="#/completed" onClick={() => displayCompleted({})}>Completed</a>
                </li>
            </ul>
            <ClearCompleted clearCompleted={todos.completedCount} />
            </div>
          );
        }

        return [state => setTodos(state)]
}