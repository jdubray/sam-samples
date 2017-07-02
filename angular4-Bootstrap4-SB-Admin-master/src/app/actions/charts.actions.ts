////////////////////////////////////////////////////////////////////////////////
// Actions
//

export var charts: any = {} ;

let dispatch = "dispatch({__event:";
let namespace = "chart";

function applyDispath(action: string,ns?:string):any {
    ns = ns || namespace ;
    if (dispatch) {
        action = dispatch+`'${ns}.${action}'`
    } else {
        action = `actions.${action}`;
    }
    return  action;
}

charts.init = (present) => {
     charts.present = present ;
} ;

// Intents enable a further decoupling between 
// the view components and the actions
charts.intents = {
    initCharts: applyDispath("initCharts"),
    // save: applyDispath("save"),
    // done: applyDispath("done"),
    // displayAll: applyDispath("displayAll"),
    // displayActive: applyDispath("displayActive"),
    // displayCompleted: applyDispath("displayCompleted"),
    // toggleAll: applyDispath("toggleAll"),
    // delete: applyDispath("delete")

} ;

charts.initCharts = (data, present) => {
    present = present || charts.present ;
    let _data : any = {charts: data.chartService.getData()} ;
    // next step of the reactive loop: present values to the model        
    present(_data) ;
    return false ;
} ;

