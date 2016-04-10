
import {state}      from 'state' ;
import {model}      from 'model' ;
import {actions}    from 'actions' ;
import {view}       from 'view' ;


state.init(view) ;
model.init(state) ;
actions.init(model.present) ;

