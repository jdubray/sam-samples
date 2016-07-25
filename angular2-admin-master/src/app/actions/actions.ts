////////////////////////////////////////////////////////////////////////////////
// Actions
//

export function Actions(mount: string) { ;
    var _present : (data: any) => void ;
    var _services : any = { } ;
    return {

        init(present: (data: any) => void) {
            _present = present ;
        },

        addService (name: string, service: any, init: boolean) {
                console.log('adding service:',name) ;
                _services[name] = service ;
                if (init) {
                    console.log('init service:\n',this.present) ;
                    // _service.getContacts().then( function(contacts: any) {
                        
                    //       this.present({init:true,newData:contacts}) ;

                    //   }
                    // ) ;
                }
            },

        dispatch (event: any, present?: (data: any) => void) {
            present = present || _present ;
            console.log('dispatching from dispatcher:') ;
            console.log(event) ;
            var props: string[] = Object.getOwnPropertyNames(this.intents) ;
        
            props.forEach( (intent) => {
                if (event.__event === intent) {
                    this[intent](event,present) ;
                }
            }) ;
        
        },

        intents: {
            feedNeedsRefresh: `dispatch({__action:'feedNeedsRefresh'`,
            chartNeedsRefresh: `dispatch({__action:'chartNeedsRefresh',`
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
                console.log('feedNeedsRefresh:\n',data) ;
            
                present = present || _present ;
                
                let _data : any = {chart: _services['LineChart'].getData()} ;
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