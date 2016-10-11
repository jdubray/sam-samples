import {Injectable} from '@angular/core';

@Injectable()
export class TodoService {

  private _todoList = [
    { id: 0, text: 'Check me out' },
    { id: 1, text: 'Lorem ipsum dolor sit amet, possit denique oportere at his, etiam corpora deseruisse te pro' },
    { id: 2, text: 'Ex has semper alterum, expetenda dignissim' },
    { id: 3, text: 'Vim an eius ocurreret abhorreant, id nam aeque persius ornatus.' },
    { id: 4, text: 'Simul erroribus ad usu' },
    { id: 5, text: 'Ei cum solet appareat, ex est graeci mediocritatem' },
    { id: 6, text: 'Get in touch with akveo team' },
    { id: 7, text: 'Write email to business cat' },
    { id: 8, text: 'Have fun with blur admin' },
    { id: 9, text: 'What do you think?' },
  ];

  getTodoList() {
    return this._todoList;
  }
}
