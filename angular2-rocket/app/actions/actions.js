var actions = {} ;

actions.present = () => alert('yes, it works') 
 
actions.display = function(present) {
    
    present = present || actions.present ;
    
    present({}) ;
    return false ;
} ;

actions.start = function(data, present) {
    present = present || actions.present ;
    data = data || {};
    data.started = true ;
    present(data) ;
    return false ;
} ;

actions.decrement = function(data, present) {
    present = present || actions.present ;
    data = data || {} ;
    data.counter = data.counter || 10 ;
    var d = data ;
    var p = present ;
    
    setTimeout(function() {
            d.counter = d.counter - 1 ;
            p(d) ;
    }, 1000) ;
} ;

actions.launch = function(data, present) {
    present = present || actions.present ;
    data.launched = true ;
    present(data) ;
} ;

actions.abort = function(data, present) {
    present = present || actions.present ;
    data.aborted = true ;
    present(data) ;
    return false ;
} ;