////////////////////////////////////////////////////////////////////////////////
// View
//
var view = {} ;

// Initial State
view.init = function(model) {
    return view.ready(model) ;
}

// State representation of the ready state
view.ready = function(model) {
    return (
            `<p>Counter:${model.counter}</p>
            <form onSubmit="return actions.start({});">
                <input type="text" placeHolder="AutoGrow Directive" autoGrow/><br>
                <input type="submit" value="Start">
            </form>`
        ) ;

}

// State representation of the counting state
view.counting = function(model) {

    return (
            `<p>Count down:${model.counter}</p>
             <form onSubmit="return actions.abort({});">
                <input type="submit" value="Abort">
            </form>`
        ) ;

}

// State representation of the aborted state
view.aborted = function(model) {

    return (
            `<p>Aborted at Counter:${model.counter}</p>`
        ) ;

}

// State representation of the launched state
view.launched = function(model) {

    return (
            `<p>Launched</p>`
        ) ;

}

//display the state representation
view.display = function(representation) {
    console.log('display not initialized') ;
    console.log(representation) ;
}

