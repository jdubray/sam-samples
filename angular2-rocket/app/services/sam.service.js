//
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var state_1 = require('../state/state');
var model_1 = require('../model/model');
var actions_1 = require('../actions/actions');
var view_1 = require('../views/view');
var SamService = (function () {
    function SamService() {
    }
    SamService.SamInstance = function (render, mount, actionsMount, services) {
        var view = view_1.View();
        var actions = actions_1.Actions(mount);
        var model = model_1.Model();
        var state = state_1.State();
        // Connect AppComponent display method
        view.display = render;
        // Wire State, Actions, Model
        state.init(view, actions);
        actions.init(model.present);
        model.init(state);
        // Mount SAM actions into the DOM
        actionsMount.actions = actions;
        return {
            view: view,
            actions: actions,
            model: model,
            state: state
        };
    };
    SamService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SamService);
    return SamService;
}());
exports.SamService = SamService;
//# sourceMappingURL=sam.service.js.map