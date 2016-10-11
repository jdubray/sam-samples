//

import {Component, Injectable} from '@angular/core';

import {State}                          from '../state/state' ;
import {Model}                          from '../model/model' ;
import {Actions}                        from '../actions/actions' ;
import {View}                           from '../views/view' ;

@Injectable()
export class SamFactory {
    
    static instance(
        app: any, 
        mount: string, actionsMount?: any, 
        services?: any[] 
        ) : any {

        let view: any = View() ;
        let actions: any = Actions(mount) ;
        
        // ********** Migrate Mdoel to Server ************
        let model: any = Model() ;
        //let model: any = ModelServer() ;
        
        

        let state: any = new State() ; //view,actions.intents
        
        state.init({actions});
        //state.init(view, actions.intents) ;

        function render(state) {
            let _state = state;

            return function(model) {
                _state.render(model);
            }
        }

        model.init(render(state)) ;
        actions.init(model.present) ;

        view.display = (sr: any) => app.render(sr,actions.dispatcher) ;

        // Mount SAM actions into the DOM
        actionsMount.actions = actions ;
        
        services = services || [] ;
        services.forEach( function(service) {
            service.type = service.type || 'actions' ;
            service.init = service.init || false ;
            if (service.service) {
                if (service.type === 'model') { model.addService(service.serviceName, service.service, service.init) ; }
                if (service.type === 'actions') { actions.addService(service.serviceName, service.service, service.init) ; }
                if (service.type === 'state') { actions.addService(service.serviceName, service.service, service.init) ; }
            }
        }) ;

        console.log('sam instance is ready') ;
        
        return { 
            view,
            actions,
            model,
            state
        }
    }

}
