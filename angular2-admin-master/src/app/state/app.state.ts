import {Injectable} from '@angular/core'
import {Subject}    from 'rxjs/Subject';

@Injectable()
export class State {

  private _view : any ;
  private _intents : any ;


  static _data = new Subject<Object>();
  static _dataStream$ = State._data.asObservable();

  static _subscriptions:Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor() { //
      
      State._dataStream$.subscribe((data) => this._onEvent(data));

    //   this._view = view ;
    //   this._intents = intents ;
  }

  notifyDataChanged(event, value) {

      let current = State._data[event];
      if (current != value) {
        State._data[event] = value;

        State._data.next({
          event: event,
          data: State._data[event]
        });
      }
  }

  subscribe(event:string, callback:Function) {
      var subscribers = State._subscriptions.get(event) || [];
      subscribers.push(callback);

      State._subscriptions.set(event, subscribers);
  }

  _onEvent(data:any) {
      var subscribers = State._subscriptions.get(data['event']) || [];
      subscribers.forEach((callback) => {
        callback.call(null, data['data']);
      });
  }

  _representation(model: any) {
      this._onEvent({event:'dashboard.feed',data:model.feed});
  }

  _nextAction(model: any) {
   
  }

  // render is called by the model as part of the SAM reactive loop
  // action -> model.present -> state.render
  render(model: any) {
      this._representation(model) ;
      this._nextAction(model) ;
  } 
}
