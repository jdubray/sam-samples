import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/distinctUntilChanged';
import { Actions } from 'app/actions/actions';
import { Model, Renderer } from 'app/model/model';
import { SamService } from 'app/services/sam.service';

export class State implements Renderer {

    private _data = new Subject<Object>();
    private _subscriptions = new Map<string, Array<Function>>();

    constructor(private sam: SamService) {
        this._data.asObservable().distinctUntilChanged().subscribe(this._onEvent);
    }

    notifyDataChanged(event, value) {
        this._data.next({
            event: event,
            data: value
        });
    }

    subscribe(event: string, callback: Function) {
        const subscribers = this._subscriptions.get(event) || [];
        subscribers.push(callback);
        this._subscriptions.set(event, subscribers);
    }

    // render is called by the model as part of the SAM reactive loop
    // action -> model.present -> state.render
    render(model: any) {
        this._representation(model);
        this._nextAction(model);
    }

    private _representation(model: any) {
        console.log(model);
        //   if (model.feed) this._onEvent({event:'dashboard.feed',data:model.feed});
        //   if (model.calendar) this._onEvent({event:'dashboard.calendar',data:model.calendar});
        if (model.charts) {
            this._onEvent({ event: 'dashboard.chartData', data: model.charts });
        }
        //   if (model.pieChart) this._onEvent({event:'dashboard.piechartData',data:model.pieChart});
        //   if (model.trafficChart) this._onEvent({event:'dashboard.doughnutData',data:model.trafficChart});
        //   if (model.usersMap) this._onEvent({event:'dashboard.mapData',data:model.usersMap});
        //   if (model.todo) this._onEvent({event:'dashboard.todoList',data:model.todo});
    }

    private _onEvent(data: any) {
        const subscribers = this._subscriptions.get(data['event']) || [];
        subscribers.forEach((callback) => {
            callback.call(null, data['data']);
        });
    }

    private _nextAction(model: any) {

    }

    // This method returns a cached value of the last known state represenation
    // It can be used as an optimization to initialize a given page
    // When possible it's preferable to use an init action instead, which
    // will ultimately publish the data to the component
    // Note: not used, see charts component ngOnInit
    stateRepresentation(component) {
        let sr = {};
        switch (component) {
            case 'dashboard.charts':
                sr = {
                    barChartData: [
                        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
                        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
                    ]
                }
        }
        return sr;
    }
}
