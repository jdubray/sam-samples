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
//import {Component,NgZone}  from '@angular/core';
var core_1 = require('@angular/core');
function compileToComponent(template, directives) {
    var ViewComponent = (function () {
        function ViewComponent() {
        }
        ViewComponent = __decorate([
            core_1.Component({
                selector: 'view',
                template: template, directives: directives
            }), 
            __metadata('design:paramtypes', [])
        ], ViewComponent);
        return ViewComponent;
    }());
    ;
    return ViewComponent;
}
var ChildComponent = (function () {
    function ChildComponent() {
    }
    ChildComponent = __decorate([
        core_1.Component({
            selector: 'child-component',
            template: 'Child'
        }), 
        __metadata('design:paramtypes', [])
    ], ChildComponent);
    return ChildComponent;
}());
var AppComponent = (function () {
    //private zone: NgZone ;
    function AppComponent(loader, injector) {
        this.loader = loader;
        this.injector = injector;
        loader.loadAsRoot(ChildComponent, '#child', injector);
    }
    AppComponent.prototype.ngOnInit = function () {
        view.display = this.render;
        //view.zone = this.zone ;
        view.component = this;
        this.render(view.init(model));
    };
    AppComponent.prototype.render = function (sr) {
        view.component.loader.loadAsRoot(compileToComponent(sr, [ChildComponent]), '#child', view.component.injector);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: '[Container]<br> <child id="child"></child> <br>[/Container]'
        }), 
        __metadata('design:paramtypes', [core_1.DynamicComponentLoader, core_1.Injector])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map