import { Injectable, ApplicationRef  } from '@angular/core';
import SAM from 'sam-pattern'


const { on, utils: { N, A} } = SAM

@Injectable({ providedIn: 'root' })
export class TodosSam {

    state 
    intents = []
    todos$ = []
    remainingTodosCount$ = 0
    completedTodosCount$ = 0

    private updateProps = (data) => {
        this.todos$ = data._todos.filter(todo => !todo.isDeleted);
        this.remainingTodosCount$ = data._todos.filter(t => !t.completed && !t.isDeleted).length
        this.completedTodosCount$ =  data._todos.filter(t => t.completed && !t.isDeleted).length
        setTimeout(() => this.ref.tick(), data._delay || 0)
    }

    constructor(
        private ref: ApplicationRef 
    ) {
    
        SAM.addInitialState({
            _todos: [
            { title: 'Learn the good parts', completed: true, editing: false, isDeleted: false },
            { title: 'Learn Angular', completed: false, editing: false, isDeleted: false },
            { title: 'Build something awesome with SAM', completed: false, editing: false, isDeleted: false },
            ],
            editingTodo: null,
            newTodo: null,
        });

        const { intents, state } = SAM.addComponent({
            actions:[
                () => ({}),
                todo => ({ complete: todo }),
                todo => ({ del: todo }),
                () => ({ clear: true }),
                title => ({ title }),
                (index, todo) => ({ startEditing: index }),
                (title) => ({ finishEditing: title }),
                todo => ({ cancelEditing: todo })
            ],
            acceptors:[
                model => ({ complete, del, clear }) => 
                    on(complete, () => model._todos[complete].completed = !model._todos[complete].completed )
                        .on(del, () =>{
                            let counter = 0;
                            do {
                                counter += model._todos[counter].isDeleted ? 0 : 1
                            } while ( counter < del)
                            model._todos[counter].isDeleted = true
                        })
                        .on(clear, () => model._todos.forEach(t => t.isDeleted = t.isDeleted || t.completed)),
                
                model => ({ title, startEditing, finishEditing, cancelEditing }) => 
                    on(title, () =>
                        model._todos.push({ title, editing: false, completed: false, isDeleted: false }))
                        .on(startEditing, () => {
                            let counter = 0;
                            do {
                                counter += model._todos[counter].isDeleted ? 0 : 1
                            } while ( counter < startEditing)
                            model._editingTodo = counter;
                            model._todos[counter].editing = true;
                            model._beforeText = model._todos[counter].title;
                        })
                        .on(finishEditing, () => {
                            model._todos[model._editingTodo].title = finishEditing;
                            model._todos[model._editingTodo].editing = false;
                            model._beforeText = '';
                        })
                        .on(cancelEditing, () => {
                            model._todos[model._editingTodo].title = model._beforeText;
                            model._todos[model._editingTodo].editing = false;
                            model._editingTodo = null;
                        })
            ],
            reactors: [
                model => () => model.itemsLeft = model._todos.filter(t => !t.isDone && !t.isDeleted).length,
                model => () => model._todos.forEach(t => t.isDeleted = t.isDeleted === undefined ? false : t.isDeleted),
                model => () => model.editingTodo = model._editingTodo,
                model => () => model.beforeText = model._beforeText
            ],
        });

        SAM.setRender(this.updateProps)

        this.state = state;
        this.intents = intents;
    }

    
}
