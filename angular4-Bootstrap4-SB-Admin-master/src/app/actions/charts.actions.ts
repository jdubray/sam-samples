////////////////////////////////////////////////////////////////////////////////
// Actions
//

import { Presenter } from 'app/actions/actions';

export class ChartsActions {

    private static dispatch = 'dispatch({__event:';
    private static namespace = 'chart';

    // TODO: not really used...
    public intents = {
        initCharts: ChartsActions.applyDispath('initCharts'),
        // save: ChartsActions.applyDispath("save"),
        // done: ChartsActions.applyDispath("done"),
        // displayAll: ChartsActions.applyDispath("displayAll"),
        // displayActive: ChartsActions.applyDispath("displayActive"),
        // displayCompleted: ChartsActions.applyDispath("displayCompleted"),
        // toggleAll: ChartsActions.applyDispath("toggleAll"),
        // delete: ChartsActions.applyDispath("delete")
    }

    private static applyDispath(action: string, ns?: string): any {
        ns = ns || ChartsActions.namespace;
        if (ChartsActions.dispatch) {
            action = ChartsActions.dispatch + `'${ns}.${action}'`
        } else {
            action = `actions.${action}`;
        }
        return action;
    }

    initCharts(event: { type: string, payload?: any }, presenter: Presenter) {
        const _data: any = { charts: event.payload.chartService.getData() };
        // next step of the reactive loop: present values to the model
        presenter.present(_data);
        return false;
    }
}
