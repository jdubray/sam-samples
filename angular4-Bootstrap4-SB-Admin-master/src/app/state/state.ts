import {Injectable} from '@angular/core'
import {Subject}    from 'rxjs/Subject';

@Injectable()
export class State {

  //private _view : any ;
  static _intents : any ;


  static _actions : any ; 

  static _data = new Subject<Object>();
  static _dataStream$ = State._data.asObservable();

  static _subscriptions:Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor() { //
      
      State._dataStream$.subscribe((data) => this._onEvent(data));

    //   this._view = view ;
    //   this._intents = intents ;
  }

  init(sam: any) {
      if (sam.actions) {
          State._actions = sam.actions ;
          State._intents = sam.actions.intents ;
      }
  }

  actions() {
      return State._actions ;
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
      console.log(model) ; 
    //   if (model.feed) this._onEvent({event:'dashboard.feed',data:model.feed});
    //   if (model.calendar) this._onEvent({event:'dashboard.calendar',data:model.calendar});
      if (model.charts) this._onEvent({event:'dashboard.chartData',data:model.charts});
    //   if (model.pieChart) this._onEvent({event:'dashboard.piechartData',data:model.pieChart});
    //   if (model.trafficChart) this._onEvent({event:'dashboard.doughnutData',data:model.trafficChart});
    //   if (model.usersMap) this._onEvent({event:'dashboard.mapData',data:model.usersMap});
    //   if (model.todo) this._onEvent({event:'dashboard.todoList',data:model.todo});
  }

  // This method returns a cached value of the last known state represenation
  // It can be used as an optimization to initialize a given page
  // When possible it's preferable to use an init action instead, which
  // will ultimately publish the data to the component
  stateRepresentation(component) {
      let sr = {} ;
      switch(component) {
          case "dashboard.charts": 
            sr = {
                barChartData:  [
                    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
                    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
                ] 
            }
      }
      return sr;
  }

  getService(name: string) {
      console.log(State._actions)
      return State._actions.getService(name) ;
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
