////////////////////////////////////////////////////////////////////////////////
// Actions
//

import { charts } from './charts.actions';    
 

export function Actions(mount: string, conf?: any):any { ;
    let _present : (data: any) => void ;
    let _services : any = { } ;
    const _mount = mount ;
    const _config = conf

    return {

        intents: {
            // feedNeedsRefresh: `dispatch({__event:'feedNeedsRefresh'`,
            // chartNeedsRefresh: `dispatch({__event:'chartNeedsRefresh'`,
            // piechartNeedsRefresh: `dispatch({__event:'piechartNeedsRefresh'`,
            // trafficchartNeedsRefresh: `dispatch({__event:'trafficchartNeedsRefresh'`,
            // calendarNeedsRefresh: `dispatch({__event:'calendarNeedsRefresh'`,
            // popularAppNeedsRefresh: `dispatch({__event:'popularAppNeedsRefresh'`,
            // usersMappNeedsRefresh: `dispatch({__event:'usersMappNeedsRefresh'`,
            // todoNeedsRefresh: `dispatch({__event:'todoNeedsRefresh'`,

            chartsInit: `dispatch({__event:'chartsInit'`,
        },

        /** 
         * General init function for all actions
         * @param {function} present - The default present method (generally the model's present method)
        */
        init(present: (data: any) => void) {
            this.charts = charts ;
            this.charts.present = present ;
            //this.intents =  [ this.intents, {todo: todo.intents} ].reduce(Object.assign, {}); // 
            this.intents = Object.assign(this.intents, {charts: charts.intents} ) ;
            
            _present = present ;
        },

        /**
         * Manages services used by the actions (e.g. data services)
         * @param {string} name - name of the service
         * @param {service} service - a reference to the service
         * @param {boolean} init - if true, calls the generic init method of the service and present the result to the model.
         */
        addService (name: string, service: any, init: boolean) {
            console.log('Adding service: '+name)
            _services[name] = service ;
            if (init) {
                // 
                if (service.init) {
                    console.log('initializing service: '+name)
                    service.init().then( function(data: any) {
                        if (data) {
                            _present({init:true, newData:data}) ;
                        }
                    })
                }
            }
        },

        getService( name: string) {
            console.log('services',_services)
            return _services[name];
        },

        /**
         * Manages the intents data structure
         * @param {string} event - the event label
         * @param {string} action - the action structure
         */
        addIntent (event: string, action: string) {
            this.intents[event] = action ;
        },

        /**
         * The dispatch method is responsible for mapping user or network events to actions. The dispatcher relies on intents to do the mapping.
         * @param {object} event - the event
         * @param {function} present - an optional present method, if undefined, the dispatcher will use the default present method
         */
        dispatch (event: any, present?: (data: any) => void) {
            present = present || _present ;
            //var props: string[] = Object.getOwnPropertyNames(this.intents) ;
        
            //props.forEach( (intent) => {
                let fqi = event.__event.split(".");
               
                    
                    console.log(fqi, event)
                    switch(fqi.length) {
                        case 1 : this[fqi[0]](event,present) ; break ;
                         case 2 : this[fqi[0]][fqi[1]](event,present) ; break ;
                    }
                
                //console.log(intent) ;
            //}) ;
        
        },

        /**
         * The compose method aggregates the proposals of multiple actions and presents it as a unit of work to the model. The composer uses an "accumulator" to combine the action proposals.
         * @param {array} events - the array of events to compose
         * @param {function} present - an optional present method, if undefined, the composer will use the default present method
         */
        compose (events: any[], present?: (data: any) => void) {
            console.log('combining events',events,this) ;
            if (events.length>0) {
                let self = this;
                let accumulate = this.accumulator();
                events.forEach( (event) => self.dispatch(event, accumulate));
                present = present || _present ;
                accumulate( {}, present || _present) ;
            }
        },

        /**
         *  
         */
        accumulator() {
            let accumulator = {}
            return function (data: any, present?: (data: any) => void) {
                var props: string[] = Object.getOwnPropertyNames(data) ;
                    props.forEach( function(prop) {
                        accumulator[prop] = data[prop] ;
                    });
                if (present) {
                    present(accumulator);
                }
            }
        }, 

        chartsInit(data: any,  present?: (data: any) => void) {
            console.log('chartsInit Action, Event:\n',data) ;

            present = present || _present ;            
            let _data : any = {charts: _services['Chart'].getData()} ;
            present(_data) ;
            return false ;
        },

    }

};