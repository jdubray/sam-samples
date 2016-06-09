const COUNTER_MAX = 10 ;

var model = {
    counter: COUNTER_MAX, 
    started: false,      
    launched: false, 
    aborted: false
} ;


model.present = function(data) {        
    if (model.state.counting(model)) {
        if (model.counter === 0) {
            model.launched = data.launched || false ;
        } else {
            model.aborted = data.aborted || false ;
            if (data.counter !== undefined) { model.counter = data.counter ; }
        }
    } else {
        if (model.state.ready(model)) {
            model.started = data.started || false ;
        }
    }
    
    model.state.render(model) ;
} ;