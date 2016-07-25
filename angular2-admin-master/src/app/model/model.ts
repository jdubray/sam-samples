//////////////////////////////////////////////////////////////////////
//  Model
// 

// Initialize the model 

export function Model() {
        var _render : (data: any) => void ;
        var _services : any = { } ;
        var _data: any = { } ;

        var _applyFilters = (data: any) => {
            // filter data
        
            return data ;
        } ;

        var _CRUD = (data: any) => {
            console.log(data);
            // CRUD

            // assign feed
            if (data.feed !== undefined) {
                
                _data.feed = data.feed;
        
            }

            if (data.chart !== undefined) {
                
                _data.chart = data.chart;
        
            }
            console.log('returning from CRUD') ;
        } ;

        var _postProcessing = () => {
            // perform ancillary assignments
            
        } ; 

        
        return {
            data: _data,
      
	        init(render: (data: any) => void) {
                _render = render ;
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

            present(data: any, render?: (data: any) => void) {
                console.log('Model presented with Data') ;
                console.log(data) ;
                render = render || _render ;

                data = data || {} ;
                
                _applyFilters(data) ;

                    _CRUD(data) ;    

                _postProcessing() ;
                console.log('model has been updated');
                // next step of the reactive loop: compute the state representation  
                render(_data) ;
            } 
    }

} ;