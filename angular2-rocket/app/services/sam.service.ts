//

import { Injectable } from '@angular/core';

import {State}                          from '../state/state' ;
import {Model}                          from '../model/model' ;
import {Actions}                        from '../actions/actions' ;
import {View}                           from '../views/view' ;

@Injectable()
export class SamService {
    
    static SamInstance(
        render: (...args: any[]) => any, 
        mount: string, actionsMount?: any, 
        services?: any[] 
        ) : any {

        let view: any = View() ;
        let actions: any = Actions(mount) ;
        let model: any = Model() ;
        let state: any = State() ;

        // Connect AppComponent display method
        view.display = render ;

        // Wire State, Actions, Model
        state.init(view, actions) ;
        actions.init(model.present) ;
        model.init(state) ;
    
        // Mount SAM actions into the DOM
        actionsMount.actions = actions ;
        
        return { 
            view,
            actions,
            model,
            state
        }
    }

}