import { Component  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Todo } from '../../../domain/todo';
import { todoTitleValidator } from '../../form/validator/todo-title';
import { TodosSam } from './todos.sam';


@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent {
  // input fields
  newTodoControl = this.fb.control('', { validators: [todoTitleValidator] });
  editTodoControls = this.fb.array([]);

  // intents
  start 
  completeIntent 
  deleteIntent
  clearIntent
  createTodoIntent
  startEditingIntent
  finishEditingIntent
  cancelEditingIntent
  removeCompletedIntent

  constructor(
    public sam: TodosSam,
    private fb: FormBuilder
  ) {
    const initialTodos = sam.state()._todos;
    initialTodos.forEach( () => this.editTodoControls.push(this.fb.group({ title: [''] })));
    [this.start, this.completeIntent, this.deleteIntent, this.clearIntent, this.createTodoIntent, this.startEditingIntent, this.finishEditingIntent, this.cancelEditingIntent, this.removeCompletedIntent] = sam.intents
    
    this.start()
  }

  addTodo() {
    if (this.newTodoControl.invalid) {
      return;
    }
    const newTodoTitle = this.newTodoControl.value;
    this.createTodoIntent(newTodoTitle);
    this.newTodoControl.reset();
    this.editTodoControls.push(this.fb.group({ title: [''] }));
  }

  toggleCompletion(index: number) {
    this.completeIntent(index);
  }

  editTodo(index: number, todo: Todo) {
    
    this.startEditingIntent(index, todo);
    this.editTodoControls.insert(
      index,
      this.fb.control(todo.title, { validators: [todoTitleValidator] }),
    );
  }

  removeTodo(index: number) {
    this.deleteIntent(index);
    this.editTodoControls.removeAt(index)
  }

  stopEditing(index: number) {
    const control = this.editTodoControls.at(index);
    if (control.invalid) {
      return;
    }
    this.finishEditingIntent(control.value);
  }

  cancelEditingTodo(index: number) {
    this.cancelEditingIntent(index);
    const control = this.editTodoControls.at(index);
    if (control.invalid) {
      return;
    } 
  }

  removeCompleted() {
    this.clearIntent();
  }
}
