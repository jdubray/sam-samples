import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {observable, computed} from 'mobx';
import {observer} from 'mobx-react';
import DevTools from 'mobx-react-devtools';

const COUNTER_MAX = 10 ;

class Actions {

    private _present: (data: any) => void

    constructor() {

    }

    setPresent(present: (data: any) => void) {
        this._present = present ;
    }

    start(data: any, present?: (data: any) => void) {
        present = present || this._present ;
        data.started = true ;
        present(data) ;
        return false ;
    }

    decrement(data: any, present?: (data: any) => void) {
        present = present || this._present ;
        data = data || {} ;
        data.counter = data.counter || 10 ;
        var d = data ;
        var p = present ;
        setTimeout(function() {
            d.counter = d.counter - 1 ;
            p(d) ;
        }, 1000) ;
    }

    launch(data: any, present?: (data: any) => void) {
        present = present || this._present ;
        data.launched = true ;
        present(data) ;
    }

    abort(data: any, present?: (data: any) => void) {
        present = present || this._present ;
        data.aborted = true ;
        present(data) ;
        return false ;
    }


}

class State {
    @observable _counter = COUNTER_MAX;
    @observable _aborted = false;
    @observable _started = false;
    @observable _launched = false;

    public actions: Actions

    constructor( a: Actions) {
        this.actions = a ;
    }

    getActions() {
        return actions ;
    }

    representation (model) {
        console.log(model) ;
        this._counter = model.counter;
        this._started = model.started;
        this._aborted = model.aborted;
        this._launched = model.launched;

    }

    // Derive the current state of the system
    @computed get ready() {
        return ((this._counter === COUNTER_MAX) && !this._started && !this._launched && !this._aborted);
    }

    @computed get counting() {
        return ((this._counter <= COUNTER_MAX) && (this._counter >= 0) && this._started && !this._launched && !this._aborted) ;
    }

    @computed get launched() {
        return ((this._counter == 0) && this._started && this._launched && !this._aborted) ;
    }

    @computed get aborted() {
        return ( ( this._counter <= COUNTER_MAX) && (this._counter >= 0) 
            && this._started && !this._launched && this._aborted ) ;
    }



// Next action predicate, derives whether
// the system is in a (control) state where
// an action needs to be invoked

    nextAction() {
        if (this.counting) {
            if (this._counter>0) {
                actions.decrement({counter: this._counter}) ;
            }

            if (this._counter === 0) {
                actions.launch({}) ;
            }
        }
    }

    render(model) {
        this.representation(model)
        this.nextAction() ;
    }
}

class Model {

    private model: any ;

    constructor(private state: State) {
        this.model = {
            counter: COUNTER_MAX, 
            started: false,      
            launched: false, 
            aborted: false
        }

        this.state.render(this.model) ;
    }
    
    present(data) {        
        if (this.state.counting) {
            if (this.model.counter === 0) {
                this.model.launched = data.launched || false ;
            } else {
                this.model.aborted = data.aborted || false ;
                if (data.counter !== undefined) { this.model.counter = data.counter ; }
            }
        } else {
            if (this.state.ready) {
                this.model.started = data.started || false ;
            }
        }
        this.state.render(this.model) ;
    }
}

@observer
class RocketLauncherView extends React.Component<{stateRepresentation: State}, {}> {
    render() {
        console.log(this.props.stateRepresentation);
        if (this.props.stateRepresentation.counting) {
            return (
                <div>
                    <p>Count down:{this.props.stateRepresentation._counter}</p>
                    <button onClick={this.abort}>
                    Abort
                    </button>
                    <DevTools />
                </div>
            );
        }
        if (this.props.stateRepresentation.aborted) {
            return (
                <div>
                    <p>Aborted at: {this.props.stateRepresentation._counter} s</p>
                    <DevTools />
                </div>
            );
        }
        if (this.props.stateRepresentation.launched) {
            return (
                <div>
                    <p>Launched</p>
                    <DevTools />
                </div>
            );
        }
        return (
            <div>
                <p>Count down:{this.props.stateRepresentation._counter}</p>
                <button onClick={this.start}>
                Start
                </button>
                <DevTools />
            </div>
        );
     }

     start = (event) => {
         event.preventDefault();
         console.log(event);
         this.props.stateRepresentation.actions.start({});
     }

     abort = (event) => {
         event.preventDefault();
         console.log(event);
         this.props.stateRepresentation.actions.abort({});
     }
};

class SAMFactory {

    static  instance(): any {

        function present(model: Model) {
            let _model = model;
            return function(data: any) {
                _model.present(data) ;
            } 
        } 

        const actions = new Actions();
        const state = new State(actions);
        const model =  new Model(state);

        actions.setPresent(present(model));

        return {state,actions,model} ;
    }

}


// Instantiating the SAM pattern
const {state,actions,model} = SAMFactory.instance() ;

ReactDOM.render(<RocketLauncherView stateRepresentation={state} />, document.getElementById('root'));
