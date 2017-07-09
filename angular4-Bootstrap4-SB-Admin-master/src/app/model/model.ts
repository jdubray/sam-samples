//////////////////////////////////////////////////////////////////////
//  Model
//

import { SamService } from 'app/services/sam.service';
import { Presenter } from 'app/actions/actions';

export interface Renderer {
    render(data: any): void
}

export class Model implements Presenter {

    private services: any = {};
    private data: any = {};

    constructor(private sam: SamService) { }

    addService(name: string, service: any, init: boolean) {
        console.log('adding service:', name);
        this.services[name] = service;
        if (init) {
            console.log('init service:\n', this.present);
            // _service.getContacts().then( function(contacts: any) {
            //       this.present({init:true,newData:contacts}) ;
            //   }
            // ) ;
        }
    }

    present(data: any, renderer?: Renderer) {
        console.log('Model presented with Data');
        console.log(data);
        renderer = renderer || this.sam.state;

        data = data || {};

        this._applyFilters(data);
        this._CRUD(data);
        this._postProcessing();

        console.log('model has been updated');

        // next step of the reactive loop: compute the state representation
        renderer.render(this.data);
    }

    private _applyFilters(data: any) {
        // filter data
        return data;
    }

    private _CRUD(data: any) {
        console.log(data);

        if (data.charts !== undefined) {
            this.data.charts = data.charts;
        }

        console.log('returning from CRUD');
    }

    private _postProcessing() {
        // perform ancillary assignments
    }
}
