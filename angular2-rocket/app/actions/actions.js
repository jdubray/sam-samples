////////////////////////////////////////////////////////////////////////////////
// Actions
//
"use strict";
function Actions(mount) {
    var _present;
    return {
        init: function (present) {
            _present = present;
        },
        intents: {
            start: mount + '.actions.start',
            abort: mount + '.actions.abort',
            display: mount + '.actions.display'
        },
        present: function () { return alert('yes, it works'); },
        display: function (present) {
            present = present || _present;
            present({});
            return false;
        },
        start: function (data, present) {
            present = present || _present;
            data = data || {};
            data.started = true;
            present(data);
            return false;
        },
        decrement: function (data, present) {
            present = present || _present;
            data = data || {};
            data.counter = data.counter || 10;
            var d = data;
            var p = present;
            setTimeout(function () {
                d.counter = d.counter - 1;
                p(d);
            }, 1000);
        },
        launch: function (data, present) {
            present = present || _present;
            data.launched = true;
            present(data);
        },
        abort: function (data, present) {
            present = present || _present;
            data.aborted = true;
            present(data);
            return false;
        }
    };
}
exports.Actions = Actions;
;
//# sourceMappingURL=actions.js.map