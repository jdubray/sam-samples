////////////////////////////////////////////////////////////////////////////////
// Actions
//

export function Actions(mount: string) {
    var _present : (data: any) => void ;

    return {
 
        init: (present: (data: any) => void) => {
            _present = present ;
        },

        intents: {
            start: mount+'.actions.start',
            abort: mount+'.actions.abort',
            display: mount+'.actions.display'
        },

	    present: () => alert('yes, it works'), 
 
        display: (present: (event: any) => void) => {
    
            present = present || _present ;
            
            present({}) ;
            return false ;
        },

        start: (data: any, present?: (event: any) => void) => {
            present = present || _present ;
            data = data || {};
            data.started = true ;
            present(data) ;
            return false ;
        }, 

        decrement: (data: any, present?: (event: any) => void) => {
            present = present || _present ;
            data = data || {} ;
            data.counter = data.counter || 10 ;
            var d = data ;
            var p = present ;
            
            setTimeout(function() {
                    d.counter = d.counter - 1 ;
                    p(d) ;
            }, 1000) ;
        },

        launch: (data: any, present?: (event: any) => void) => {
            present = present || _present ;
            data.launched = true ;
            present(data) ;
        },

	    abort : (data: any, present?: (event: any) => void) => {
            present = present || _present ;
            data.aborted = true ;
            present(data) ;
            return false ;
        }
    }
} ;