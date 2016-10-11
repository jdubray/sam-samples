import {Component, ViewEncapsulation} from '@angular/core';
import {BaThemeConfigProvider} from '../../../theme';

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

  constructor(private _baConfig:BaThemeConfigProvider, private _todoService:TodoService, public _state:State) {
    //this.todoList = this._todoService.getTodoList();

    this._state.subscribe('dashboard.todoList', (todoList) => {
        if (todoList) { 
          this.todoList = todoList;

        this.todoList.forEach((item) => {
          item.color = this._getRandomColor();
        });
        }
        //this.ref.detectChanges() ;
    }); 

    
  }

  getNotDeleted() {
    return this.todoList.filter((item:any) => {
      return !item.deleted
    })
  }

  addToDoItem($event) {
    console.log($event);
    if (($event.which === 1 || $event.which === 13) && this.newTodoText.trim() != '') {

      this.todoList.unshift({
        text: this.newTodoText,
        color: this._getRandomColor(),
      });
      this.newTodoText = '';
    }
  }

  delete($event) {
    let deletedElement = $event.target.parentElement.innerText;
    let self = this;
    
    this.todoList.forEach(function(item,index) {
      if (item.text === deletedElement) {
        //item.deleted = true ;
        if (self._state) { 
          let actions = self._state.actions()
          if (actions) { actions.todo.delete({id:index}); } else { console.log('actions is undefined')}
          } 
      }
    });

  }

  private _getRandomColor() {
    let colors = Object.keys(this.dashboardColors).map(key => this.dashboardColors[key]);

    var i = Math.floor(Math.random() * (colors.length - 1));
    return colors[i];
  }
}
