//

import { Component, Injectable } from '@angular/core';

import { State } from '../state/state';
import { Model } from '../model/model';
import { Actions } from '../actions/actions';
import { View } from '../views/view';

@Injectable()
export class SamService {

    public readonly actions: Actions;
    public readonly model: Model;
    public readonly state: State;

    constructor() {
        // view stuffs are handled directly via subscriptions to state in components
        // const view = new View();
        this.actions = new Actions(this);
        // ********** Migrate Model to Server ************
        this.model = new Model(this);
        // let model: any = ModelServer() ;
        this.state = new State(this);
        // view.init(sr => app.render(sr, actions.dispatcher))
    }

    init(services: { type?: 'actions' | 'model' | 'state', serviceName: string, service: any, init?: boolean }[]) {
        services.forEach(service => {
            service.type = service.type || 'actions';
            service.init = service.init || false;
            if (service.type === 'model') { this.model.addService(service.serviceName, service.service, service.init); }
            if (service.type === 'actions') { this.actions.addService(service.serviceName, service.service, service.init); }
            if (service.type === 'state') { this.actions.addService(service.serviceName, service.service, service.init); }
        });
        console.log('sam service is ready');
    }

}
