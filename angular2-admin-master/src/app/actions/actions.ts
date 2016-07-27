////////////////////////////////////////////////////////////////////////////////
// Actions
//

export function Actions(mount: string, conf?: any) { ;
    let _present : (data: any) => void ;
    const _services : any = { } ;
    const _mount = mount ;
    const _config = conf

    return {

        /** 
         * General init function for all actions
         * @param {function} present - The default present method (generally the model's present method)
        */
        init(present: (data: any) => void) {
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
                    service.init().then( function(data: any) {
                        if (data) {
                            _present({init:true, newData:data}) ;
                        }
                    })
                }
            }
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
            var props: string[] = Object.getOwnPropertyNames(this.intents) ;
        
            props.forEach( (intent) => {
                if (event.__event === intent) {
                    this[intent](event,present) ;
                }
            }) ;
        
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

        intents: {
            feedNeedsRefresh: `dispatch({__event:'feedNeedsRefresh'`,
            chartNeedsRefresh: `dispatch({__event:'chartNeedsRefresh'`,
            piechartNeedsRefresh: `dispatch({__event:'piechartNeedsRefresh'`,
            trafficchartNeedsRefresh: `dispatch({__event:'trafficchartNeedsRefresh'`,
            calendarNeedsRefresh: `dispatch({__event:'calendarNeedsRefresh'`,
            popularAppNeedsRefresh: `dispatch({__event:'popularAppNeedsRefresh'`,
            usersMappNeedsRefresh: `dispatch({__event:'usersMappNeedsRefresh'`,
            todoNeedsRefresh: `dispatch({__event:'todoNeedsRefresh'`
            // ,edit: mount+'.actions.edit({',
            // save: mount+'.actions.save({',
            // delete: mount+'.actions.delete({',
            // filter: mount+'.actions.filter({',
            // search: `dispatch({__action:'search',`
        },

        feedNeedsRefresh(data: any, present?: (data: any) => void) {
                console.log('feedNeedsRefresh:\n',data) ;
                
                present = present || _present ;
                
                let _data : any = {feed: _services['Feed'].getData()} ;
                present(_data) ;
                return false ;
        },

        chartNeedsRefresh(data: any, present?: (data: any) => void) {
                console.log('chartNeedsRefresh:\n',data) ;
            
                present = present || _present ;
                
                let _data : any = {chart: _services['LineChart'].getData()} ;
                present(_data) ;
                return false ;
        },

        piechartNeedsRefresh(data: any, present?: (data: any) => void) {
                console.log('piechartNeedsRefresh:\n',data) ;
            
                present = present || _present ;
                
                let _data : any = {piechart: _services['PieChart'].getData()} ;
                present(_data) ;
                return false ;
        },

        trafficchartNeedsRefresh(data: any, present?: (data: any) => void) {
                console.log('trafficchartNeedsRefresh:\n',data) ;
            
                present = present || _present ;
                
                let _data : any = {piechart: _services['TrafficChart'].getData()} ;
                present(_data) ;
                return false ;
        },



        calendarNeedsRefresh(data: any, present?: (data: any) => void) {
                console.log('calendarNeedsRefresh:\n',data) ;
            
                present = present || _present ;
                
                let _data : any = {chart: _services['Calendar'].getData()} ;
                present(_data) ;
                return false ;
        },

        // popularAppNeedsRefresh(data: any, present?: (data: any) => void) {
        //         console.log('popularAppNeedsRefresh:\n',data) ;
            
        //         present = present || _present ;
                
        //         let _data : any = {chart: _services['PopularApp'].getData()} ;
        //         present(_data) ;
        //         return false ;
        // },

        todoNeedsRefresh(data: any, present?: (data: any) => void) {
                console.log('todoNeedsRefresh:\n',data) ;
            
                present = present || _present ;
                console.log(_services['ToDo']) ;
                let _data : any = {chart: _services['ToDo'].getTodoList()} ;
                present(_data) ;
                return false ;
        },

        usersMappNeedsRefresh(data: any, present?: (data: any) => void) {
                console.log('usersMappNeedsRefresh:\n',data) ;
                
                present = present || _present ;
                
                let _data : any = {chart: _services['UsersMap'].getData()} ;
                present(_data) ;
                return false ;
        }
        // search(data: any, present?: (data: any) => void) {
        //         console.log('searching:\n',present) ;
            
        //         present = present || _present ;
        //         this.filter({focus:data.id, name: data.name},present) ;
        //         return false ;
        // },

        // filter(data: any, present?: (data: any) => void) {
        //     console.log('filtering:\n',present) ;
        //     present = present || _present ;
        //     let _data : any = {startWith: data.name} ;
        //     if (data.focus) {
        //         _data.focus = data.focus ;
        //     }
        //     // next step of the reactive loop: present values to the model        
        //     present(_data) ;
        //     return false ;
        // },

 	    // edit(data: any, present?: (data: any) => void) {
        //     console.log('editing:\n',present) ;
        //     present = present || _present ;
        //     data = {editItemId: data.id} ;
        //     // next step of the reactive loop: present values to the model        
        //     present(data) ;
        //     return false ;
        // },

        // save(data: any, present?: (data: any) => void) {
        //     console.log('saving:\n',present) ;
            
        //     present = present || _present ;
        //     let _data: any = {} ;
        //     _data.item = {name: data.name, city: data.city, email: data.email, number: data.number, id: data.id || null} ;
        //     // next step of the reactive loop: present values to the model        
        //     present(_data) ;
        //     return false ;
        // },

	    // delete(data: any, present?: (data: any) => void) {
        //     console.log('deleting:\n',present) ;
            
        //     present = present || _present ;
        //     data.id = data.id || -1 ;
        //     data = {deletedItemId: data.id} ;
        //     // next step of the reactive loop: present values to the model        
        //     present(data) ;
        //     return false ;
        // } 
    }

};