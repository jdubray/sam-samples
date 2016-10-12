import {Injectable} from '@angular/core';

@Injectable()
export class TodoService {

  private _todoList = [
    { id: 0, text: 'Get familiar with SAM' },
    { id: 1, text: 'Download SAM Samples' },
    { id: 2, text: 'Run TODOMVC sample' },
    { id: 3, text: 'Write a sample' },
    { id: 4, text: 'Join the Github chat room' },
    { id: 5, text: 'Share with a tweet' },
    { id: 6, text: 'Try it at work' },
    { id: 7, text: 'Tell us what do you think?' },
  ];

  getTodoList() {
    return this._todoList;
  }
}
