//////////////////////////////////////////////////////////////////////
//  Model
// 

export function Model() {
        const COUNTER_MAX: number = 10 ;
        
        var _state : any ;

        var _data: any ;

        var _instance = {
            data: _data,
      
	        init: (state: any, data?: any) => {
                _state = state ;
                _data = data || { 
                    counter: COUNTER_MAX, 
                    started: false,      
                    launched: false, 
                    aborted: false,
                    COUNTER_MAX: COUNTER_MAX
                }
                console.log(_state) ;
                _state.render(_data) ;
            },

            present: (data: any) => {  
                data = data || {} ;

                if (_state.counting(_data)) {
                    if (_data.counter === 0) {
                        _data.launched = data.launched || false ;
                    } else {
                        _data.aborted = data.aborted || false ;
                        if (data.counter !== undefined) { _data.counter = data.counter ; }
                    }
                } else {
                    if (_state.ready(_data)) {
                        _data.started = data.started || false ;
                    }
                }
        
                _state.render(_data) ;
            }
        }

        return _instance ;

} ;

