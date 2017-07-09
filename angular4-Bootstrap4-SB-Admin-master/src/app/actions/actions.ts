////////////////////////////////////////////////////////////////////////////////
// Actions
//

import { ChartsActions } from './charts.actions';
import { Model } from 'app/model/model';
import { SamService } from 'app/services/sam.service';

export interface Presenter {
    present(data: any): void
}

export class Actions {

    private _services: any = {};

    private subActions = {
        charts: new ChartsActions()
    }

    // TODO: not really used...
    public readonly intents = {
        // feedNeedsRefresh: `dispatch({__event:'feedNeedsRefresh'`,
        // chartNeedsRefresh: `dispatch({__event:'chartNeedsRefresh'`,
        // piechartNeedsRefresh: `dispatch({__event:'piechartNeedsRefresh'`,
        // trafficchartNeedsRefresh: `dispatch({__event:'trafficchartNeedsRefresh'`,
        // calendarNeedsRefresh: `dispatch({__event:'calendarNeedsRefresh'`,
        // popularAppNeedsRefresh: `dispatch({__event:'popularAppNeedsRefresh'`,
        // usersMappNeedsRefresh: `dispatch({__event:'usersMappNeedsRefresh'`,
        // todoNeedsRefresh: `dispatch({__event:'todoNeedsRefresh'`,
        chartsInit: `dispatch({__event:'chartsInit'`,
    }

    constructor(private sam: SamService) {
        // TODO: not really used...
        this.intents = { ...this.intents, charts: this.subActions.charts.intents };
    }

    /**
     * Manages services used by the actions (e.g. data services)
     * @param {string} name - name of the service
     * @param {service} service - a reference to the service
     * @param {boolean} init - if true, calls the generic init method of the service and present the result to the model.
     */
    addService(name: string, service: any, init: boolean) {
        console.log('Adding service: ' + name)
        this._services[name] = service;
        if (init) {
            if (service.init) {
                console.log('initializing service: ' + name)
                service.init().then(data => {
                    if (data) {
                        this.sam.model.present({ init: true, newData: data });
                    }
                })
            }
        }
    }

    getService(name: string) {
        console.log('services', this._services)
        return this._services[name];
    }

    /**
     * Manages the intents data structure
     * @param {string} event - the event label
     * @param {string} action - the action structure
     */
    addIntent(event: string, action: string) {
        this.intents[event] = action;
    }

    /**
     * The dispatch method is responsible for mapping user or network events to actions.
     * The dispatcher relies on intents to do the mapping.
     * @param {object} event - the event
     * @param {function} present - an optional present method, if undefined, the dispatcher will use the default present method
     */
    dispatch(event: { type: string, payload?: any }, presenter?: Presenter) {
        presenter = presenter || this.sam.model;
        // var props: string[] = Object.getOwnPropertyNames(this.intents) ;
        // props.forEach( (intent) => {
        // console.log(intent) ;
        // }) ;

        const fqi = event.type.split('.');

        console.log(fqi, event)
        switch (fqi.length) {
            // e.g. chartsInit below
            case 1: this[fqi[0]](event, presenter); break;
            // e.g. charts.initCharts
            case 2: this.subActions[fqi[0]][fqi[1]](event, presenter); break;
        }
    }

    /**
     * The compose method aggregates the proposals of multiple actions and presents it as a unit of work to the model.
     * The composer uses an "accumulator" to combine the action proposals.
     * @param {array} events - the array of events to compose
     * @param {function} present - an optional present method, if undefined, the composer will use the default present method
     */
    compose(events: { type: string, payload?: any }[], presenter?: Presenter) {
        console.log('combining events', events, this);
        presenter = presenter || this.sam.model;
        if (events.length > 0) {
            const accumulator: any = {}
            const accumulate = {
                present(data: any) {
                    const props: string[] = Object.getOwnPropertyNames(data);
                    props.forEach(prop => accumulator[prop] = data[prop]);
                }
            }
            events.forEach(event => this.dispatch(event, accumulate));
            presenter.present(accumulator);
        }
    }

    // Note: not used, see charts component ngOnInit
    chartsInit(data: any, presenter: Presenter) {
        console.log('chartsInit Action, Event:\n', data);
        presenter = presenter || this.sam.model;
        const _data: any = { charts: this._services['Chart'].getData() };
        presenter.present(_data);
        return false;
    }
}
