////////////////////////////////////////////////////////////////////////////////
// View
//
export function View() {
    var _intents : any ;
    var _ready = (model: any, intents: any) => {
            return (
                    `<p>Counter:${model.counter}</p>
                    <form onSubmit="return ${intents['start']}({});">
                        [Directive]<br>
                        <input type="text" placeHolder="AutoGrow Directive" autoGrow/><br>
                        [/Directive]<br>
                        <br>    
                        <input type="submit" value="Start">
                    </form>`
                ) ;

        } ;

    return {
        // Initial State
        init : (model: any, intents: any) => {
            return _ready(model, intents) ;
        },

        // State representation of the ready state
        ready:  _ready, 

        // State representation of the counting state
        counting : (model: any, intents: any) => {

            return (
                    `<p>Count down:${model.counter}</p>
                    <form onSubmit="return ${intents['abort']}({});">
                        <input type="submit" value="Abort">
                    </form>`
                ) ;

        }, 

        // State representation of the aborted state
        aborted : (model: any, intents: any) => {

            return (
                    `<p>Aborted at Counter:${model.counter}</p>`
                ) ;

        }, 

        // State representation of the launched state
        launched : (model: any, intents: any) => {

            return (
                    `<p>Launched</p>`
                ) ;

        }, 

        //display the state representation
        display : (representation: string) => {
            console.log('display not initialized') ;
            console.log(representation) ;
        }
    }
} ; 