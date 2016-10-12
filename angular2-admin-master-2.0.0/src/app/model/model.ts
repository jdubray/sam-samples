//////////////////////////////////////////////////////////////////////
//  Model
// 
import { todo } from './todo.model';
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

            if (data.pieChart !== undefined) {
                
                _data.pieChart = data.pieChart;
        
            }

            if (data.trafficChart !== undefined) {
                _data.trafficChart = data.trafficChart;
        
            }

            if (data.calendar !== undefined) {
                
                _data.calendar = data.calendar;
        
            }

            if (data.todoList !== undefined) {
                _data.todo = _data.todo || {} ;
                _data.todo.todoList = data.todoList;
            }

            if (data.usersMap !== undefined) {
                
                _data.usersMap = data.usersMap;
        
            }

            todo(_data,data) ;

            // // delete completed item(s)
            //     if (data.deletedItemId !== undefined) {
            //         if (data.deletedItemId < 0) {
            //             // delete all completed items
            //             _data.todoList.forEach(function(el,index) {
            //                 _data.todoList[index].deleted = _data.todoList[index].deleted || _data.todoList[index].checked ;
            //             });
            //         } else {
            //             // delete spectific item
            //             _data.todoList.forEach(function(el,index) {
            //                 if (el.id !== undefined) {
            //                     if (el.id == data.deletedItemId) {
            //                         _data.lastDeleted = _data.todoList[index] ;
            //                         _data.todoList[index].deleted = true ;      
            //                     }
            //                 }
            //             });
            //         }
            //     }
            //     console.log(JSON.stringify(_data.todoList,null,4)) ;
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