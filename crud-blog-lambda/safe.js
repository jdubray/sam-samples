/******************************************************************************************* 
 * The MIT License (MIT)
 * -----------------------------------------------------------------------------------------
 * Copyright (c) 2016 Convergence Modeling LLC 
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of 
 * this software and associated documentation files (the "Software"), to deal in the 
 * Software without restriction, including without limitation the rights to use, copy, 
 * modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
 * and to permit persons to whom the Software is furnished to do so, subject to the 
 * following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE 
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 *  
 * https://opensource.org/licenses/MIT
 * 
 */
 
 
 
 

// /////////////////////////////////////////////////////////////////
// State-Action Fabric Element 
// SAFE is a micro-container for server-side SAM implementations
// 
// SAFE implements the following services
//  - action dispatcher 
//  - action hang back
//  - session dehydration / hydration
//  - enforces allowed actions and action "hang back"
//  - logging
//  - server side time travel
//
//  TODO
//  - caching (idempotent actions)


'use strict' ;

// import { saveSnapshot, getSnapshot } from './timeTravelStore.js'  ;

let safe = {} ;


// minimal service implementations

// session manager 

safe.defaultSessionManager = {
    
    dehydrateSession: (model) => {
        if (model.__token) {
            safe.defaultSessionManager[model.__token] = safe.deepCopy(model) ;
        }
    },
    
    rehydrateSession: (token) => {
        let session =  safe.defaultSessionManager[token] ;
        return Promise.resolve(session) ; 
    }
    
} ;

// logger

safe.defaultLogger = {
    output: (level,message) => {
        var timestamp = new Date().getTime() ;
        var m = message ;
        if (typeof message !== 'string') {
            m = JSON.stringify(message) ;
        }
        console.log([level,timestamp,m].join(' : ')) ;
    },
    warning: (message) => {
        if (safe.logger.loggingLevel <=1) { safe.logger.output('[WARNING] ',message) ; }
    },
    info: (message) => {
        if (safe.logger.loggingLevel <=0) { safe.logger.output('[INFO]    ',message) ; }
    },
    error: (message) => {
        if (safe.logger.loggingLevel <=2) { 
            safe.logger.output('[ERROR]   ',message) ; 
            throw message ;
        }
    },
    loggingLevel: 0
} ;

// error handler

safe.defaultErrorHandler = (message,next) => {
   safe.logger.error(message) ; 
   next(message) ;
} ;

// default in memory store for time travel 

safe.defaultSnapshotStore = (function() {
    let store = [] ;
    
    return {
        
        store: (i,s) => {
            store[i] = s ;
            return store.length ;
        },
        
        retrieve: (i) => {
            if ((i>=0) && (i<store.length)) {
                
                return store[i] ;
                
            } else {
                
                return {} ;
                
            }
        },
        
        retrieveAll: () => {
            return store ;
        },
        
        length: () => {
            return store.length ;
        }
    } ;
    
})() ;

// time traveler

safe.defaultTimeTraveler = (store) => {
    let snapshotStore = store || safe.defaultSnapshotStore ;
    let cursor = -1 ;
    let display = (res,representation) => {
        res.status(200).send(representation) ;
    } ; 
    return {
        init: (app,path, next) => {
            
            // substitute default response function with next
            display = next || display ;
            
            // API : returns a given snapshot or all if index is negative 
            app.get(path+'/:snapshot', function(req,res) { 
                
                let index = req.params.snapshot ;
                res.setHeader("Content-Type", "application/json");
                display(res,JSON.stringify(safe.getSnapshot(index))) ;
                
            }) ;
            
            app.get(path, function(req,res) { 
                res.setHeader("Content-Type", "application/json") ;
                display(res,JSON.stringify(safe.getSnapshot())) ;
                
            }) ;
            
            // travel back
            app.post(path+'/:snapshot', function(req,res) { 
                
                let dis = (representation) => {
                    let resp = res ;
                    display(resp,representation) ;
                }
                
                let index = req.params.snapshot ;
                
                if (index>=0) {
                    let snapshot = snapshotStore.retrieve(index) ;
                    if ((index>=0) && (index<snapshotStore.length())) {
                        cursor = index ;
                    } 
                    let m = safe.deepCopy(snapshot.store) ;
                    m.__token = req.cookies['safe_token'] || '' ;
                    
                    let modelProperties = Object.getOwnPropertyNames(safe.model).filter(function (p) {
                        return typeof safe.model[p] !== 'function';
                    }) ;
                    
                    let snapShotProperties = Object.getOwnPropertyNames(m) ;
                    
                    modelProperties.forEach(function(p) {
                        delete safe.model[p] ;
                    });
                    
                    snapShotProperties.forEach(function(p) {
                       safe.model[p] = m[p] ; 
                    });
                    
                    safe.render(safe.model,dis,false) ;
                }
            }) ;
        },
        
        saveSnapshot: (model,dataset) => {
            let snapshot = snapshotStore.retrieve(cursor) ;
            if (dataset) {
                cursor++ ;
                snapshot = {} ;
                snapshot.dataset = safe.deepCopy(dataset) ;
            }
            
            if (model) {
                snapshot.store = safe.deepCopy(model) ;
            } 
            
            return snapshotStore.store(cursor,snapshot) ;
            
        },
        
        getSnapshot: (i) => {
            i = i || -1 ;
            
            if (i>=0) { 
                return snapshotStore.retrieve(i); 
            } else {
                return snapshotStore.retrieveAll() ;
            }
        },
        
        displayTimeTravelControls: (representation) => {
            
            return (representation + 
            '          <br>\n<br>\n<hr>\n<div class="mdl-cell mdl-cell--6-col">\n'+
            '                      <input id="__snapshot" type="text" class="form-control"><br>\n'+
            '                      <button id="__travel" onclick="JavaScript:return travel({\'snapshot\':document.getElementById(\'__snapshot\').value});"> TimeTravel </button>\n'+
            '          </div><br><br>\n') ;
        }
        
        
    } ;
} ;

safe.swapModel = (newModel) => {
    let modelProperties = Object.getOwnPropertyNames(safe.model).filter(function (p) {
        return typeof safe.model[p] !== 'function';
    }) ;
    
    let newProps = Object.getOwnPropertyNames(newModel) ;
    
    modelProperties.forEach(function(p) {
        delete safe.model[p] ;
    });
    
    newProps.forEach(function(p) {
       safe.model[p] = newModel[p] ; 
    });
} ;


// SAFE Core

// Insert SAFE middleware and wire SAM components

safe.init = (actions, model, state, view, logger, errorHandler, sessionManager) => {
    
    safe.actions = actions ;
    safe.model = model ;
    safe.state = state ;
    safe.view = view ;
    
    safe.errorHandler = errorHandler || safe.defaultErrorHandler ;
    
    safe.logger = logger || safe.defaultLogger ;
    
    safe.hangback = false ;
    safe.steps = [] ;
    safe.stepCount = 0 ;
    safe.lastStep = safe.newStep(safe.stepCount) ;
    
    safe.sessionManager = sessionManager || safe.defaultSessionManager ;
    
    safe.allowedActions = [] ;
    
    if (actions) {
        if (model) {
            actions.init(safe.present) ;       
        }
    } 
    
    
    if (state) {
    
        if (model) {
            model.init(safe.render) ;
            state.init(safe.render, safe.view) ;
        }
        
        if (view) {
            if (actions) {
                state.init(null,view, safe.display, actions.intents) ;
            } else {
                state.init(null,view, safe.display) ;
            }
        }
        
        safe.allowedActions = state.allowedActions || [] ;
        
    } else {
        // we initialize with a pass trough represent method
        safe.state = {
            representation: (model,next) => {
                safe.logger.info('state representation '+JSON.stringify(model)) ;
                    
                next(JSON.stringify(model.data)) ;
            },
            
            nextAction: (model) => { }, 
            
            allowedActions: [] 
        } ;
        
        safe.allowedActions = [] ;
        
        if (!model) {
            // When there is no "model" specified
            // SAFE instantiate a generic model
            // that accepts all data
            safe.model = {
                init: (render) => {
                    safe.model.render = render  ;
                },
                
                present: (data,next) => {
                    // this model accepts all data
                    // ie another model
                    safe.logger.info('model accepting '+JSON.stringify(data)) ;
                    safe.model.data = data ;
                    
                    const render = safe.model.render || safe.render ;
                    render(safe.model,next) ;
                }
                      
            }
            
            if (!actions) { 
                safe.actions = {} ;
            }
        }
    }
} ;

safe.initTimeTraveler = (timeTraveler) => {
    if (timeTraveler) {
        safe.saveSnapshot = timeTraveler.saveSnapshot || null ;
        safe.getSnapshot = timeTraveler.getSnapshot || null ;
        safe.displayTimeTravelControls = timeTraveler.displayTimeTravelControls || null ;
    } 
} ;

// The Dispatcher is an optional component which 
// exposes a dispatch API 

safe.dispatcher = (app,path,next) => {
    // assumes express cookie-parser middleware
    
    app.post(path, function(req,res) { 
        var ret = (representation) => {
                        res.status(200).send(representation) ;
                    } ;
        var data = req.body ;
        
        safe.logger.info('dispatcher received request '+JSON.stringify(data)+' action is '+data.__action) ;
    
        data.__token = req.cookies['safe_token'] || '' ;
        
        safe.dispatch(data.__action,data,next || ret) ;
    }) ;
    
} ;

// The dispatch method decides whether an action can be dispatched
// based on SAFE's context

safe.dispatch = (action,data,next) => {
    data = data || {} ;
    var dispatch = false ;
    const lastStepActions = safe.lastStep.actions ; 
    
    safe.logger.info('dispatcher received request '+action+' '+JSON.stringify(data)) ;
    safe.logger.info('lastStepActions             '+JSON.stringify(lastStepActions)) ;
    if (lastStepActions.length === 0) {
        // action validation is disabled
        dispatch = true ;
    } else {
        lastStepActions.forEach( (a) => {
            safe.logger.info(a) ;
            if (a.action === action) {
                dispatch = true ;
                // tag the action with the stepid
                // we want to enforce one action per step
                // if the step does not match we should not dispatch
                data.__actionId = a.uid ;
                safe.logger.info('tagging action with            '+JSON.stringify(a)) ;
            
                safe.lastStep.dispatched = action ;
            }
        }) ;
    }
    if (!dispatch) {
        safe.errorHandler({action: action, error: "this "+action+" is not allowed"},next) ;
    } else {
            
        if (safe.actions[action] !== undefined) {
            
            // dispatch action
            safe.logger.info('invoking action            '+JSON.stringify(data)) ;
            safe.actions[action](data,next) ;
           
        } else { 
            if (action === '__present') {
                // SAFE supports a generic "present" action 
                safe.present(data,next) ;    
            } else {
                safe.errorHandler({action: action, error: action+" action not found"},next) ;  
            }
        }
        
    }

} ;


safe.present = (data,next) => {
    const actionId = data.__actionId || null ;
    
    if (!safe.blocked) {
        const lastStepActions = safe.lastStep.actions ; 
        safe.logger.info(lastStepActions) ;
        var presentData = (lastStepActions.length === 0) ;
        if (!presentData) { 
            // are we expecting that action?
            lastStepActions.forEach(function(el) {
                if (el.uid === actionId) {
                    presentData = true ;
                }
            }); 
        }
        
        if (presentData) {
            safe.block() ;
            
            if (safe.saveSnapshot) {
                // Store snapshot in TimeTravel
                safe.saveSnapshot(null,data) ;
            }
            
            if (data.__token !== undefined) {
                
                safe.model.__session = safe.sessionManager.rehydrateSession(data.__token)
                
                .then( (value) => {
                    
                    safe.swapModel(value) ;
                    safe.model.__token = data._token ;
                    
                    console.log('-- safe present rehydrateSession -- '+data.__token) ;
                    console.log(safe.model) ;
                    console.log('---------------------') ;
                    safe.model.present(data,next) ;
                }) ;
                
                
            } else {
                
                safe.model.present(data,next) ;
            }
        } else {
            // unexpected actions
            // possibly an action from previous step that needs to be blocked
        }
    } else {
        // ignore action's effect
        safe.logger.info({blocked: true,data}) ;
    }    
} ;

safe.block = () => {
    safe.lastStep.actions = [] ;
    safe.blocked = true ;
} ;

safe.unblock = () => {
    safe.blocked = false ;
} ;

safe.newStep = (uid,allowedActions) => {
    allowedActions = allowedActions || [ ] ;
    var k = 0 ;
    var step = { 
        stepid: uid , actions: allowedActions.map((action) => {
            var auid = uid + '_' + k++ ;
            return { action, uid: auid } ;   
    })  } ;
    
    safe.steps.push(step) ;
    safe.logger.info('new step        :'+JSON.stringify(step)) ;
    return step ;
} ;

safe.render = (model,next, takeSnapShot) => {
    
    takeSnapShot = takeSnapShot || true ;
    //safe.logger.info('time travel '+takeSnapShot+' '+safe.saveSnapshot) ;
    if (takeSnapShot && safe.saveSnapshot) {
        // Store snapshot in TimeTravel
        safe.logger.info('taking snapshot '+JSON.stringify(model)) ;
        safe.saveSnapshot(model,null) ;
    }
    safe.allowedActions = safe.state.representation(model,next) || [] ;
    safe.unblock() ;
    safe.lastStep = safe.newStep(safe.stepCount++, safe.allowedActions) ;
    
    safe.sessionManager.dehydrateSession(model) ;
    
    safe.state.nextAction(model) ;
} ;

safe.display = (representation,next) => {
    if (safe.displayTimeTravelControls) {
        representation = safe.displayTimeTravelControls(representation) ;
    }
    safe.view.display(representation,next) ;
} ;

safe.deepCopy = function(x) {
    return JSON.parse(JSON.stringify(x)) ;
} ;




module.exports = safe ;