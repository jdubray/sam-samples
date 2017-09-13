import {Component, ViewEncapsulation} from '@angular/core';
// import {BaThemeConfigProvider} from '../../../theme';

import {TodoService} from '../../../services/todo.service';

import {State} from "../../../state/state";

@Component({
  selector: 'todo',
  encapsulation: ViewEncapsulation.None,
  styles: [require('./todo.scss')],
  template: require('./todo.html')
})
export class Todo {
  
  public dashboardColors = this._baConfig.get().colors.dashboard;

  public todoList:Array<any>;
  public newTodoText:string = '';
  
  constructor(//private _baConfig:BaThemeConfigProvider, 
              private _todoService:TodoService, 
              public _state:State) {
    
    this._state.subscribe('dashboard.todoList', (todo) => {
        if (todo) { 
          todo.todoList = todo.todoList || [] ;
          this.todoList = todo.todoList;
          
          this.todoList.forEach((item) => {
            item.color = this._getRandomColor();
          });
        }
    }); 
  }

  getNotDeleted() {
    return this.todoList.filter((item:any) => {
      return !item.deleted
    })
  }

  checkTodo($event) {
    this._state.actions().todo.done({id:$event.target.id}) ;
  }


  addToDoItem($event) {
    this._state.actions().todo.save({text:this.newTodoText}) ;
  }

  delete($event) {
    this._state.actions().todo.delete({id: $event.target.id}) ;
  }

  private _getRandomColor() {
    let colors = Object.keys(this.dashboardColors).map(key => this.dashboardColors[key]);

    var i = Math.floor(Math.random() * (colors.length - 1));
    return colors[i];
  }
}
