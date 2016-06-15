"use strict";
////////////////////////////////////////////////////////////////////////////////
// View
//
function View() {
    var _intents;
    var _ready = function (model, intents) {
        return ("<p>Counter:" + model.counter + "</p>\n                    <form onSubmit=\"return " + intents['start'] + "({});\">\n                        [Directive]<br>\n                        <input type=\"text\" placeHolder=\"AutoGrow Directive\" autoGrow/><br>\n                        [/Directive]<br>\n                        <br>    \n                        <input type=\"submit\" value=\"Start\">\n                    </form>");
    };
    return {
        // Initial State
        init: function (model, intents) {
            return _ready(model, intents);
        },
        // State representation of the ready state
        ready: _ready,
        // State representation of the counting state
        counting: function (model, intents) {
            return ("<p>Count down:" + model.counter + "</p>\n                    <form onSubmit=\"return " + intents['abort'] + "({});\">\n                        <input type=\"submit\" value=\"Abort\">\n                    </form>");
        },
        // State representation of the aborted state
        aborted: function (model, intents) {
            return ("<p>Aborted at Counter:" + model.counter + "</p>");
        },
        // State representation of the launched state
        launched: function (model, intents) {
            return ("<p>Launched</p>");
        },
        //display the state representation
        display: function (representation) {
            console.log('display not initialized');
            console.log(representation);
        }
    };
}
exports.View = View;
;
//# sourceMappingURL=view.js.map