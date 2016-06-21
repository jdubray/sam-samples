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
var autogrow_directive_1 = require('./directives/autogrow.directive');
var sam_service_1 = require('./services/sam.service');
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
        this.complete = new core_1.EventEmitter();
    }
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ChildComponent.prototype, "complete", void 0);
    ChildComponent = __decorate([
        core_1.Component({
            selector: 'child-component',
            template: 'Child',
            directives: [autogrow_directive_1.AutoGrowDirective],
        }), 
        __metadata('design:paramtypes', [])
    ], ChildComponent);
    return ChildComponent;
}());
var AppComponent = (function () {
    function AppComponent(loader, injector) {
        this.loader = loader;
        this.injector = injector;
        // Initialize Component Structure
        AppComponent._loader = loader;
        AppComponent._injector = injector;
        // Create a SAM instance
        AppComponent._sam = sam_service_1.SamService.SamInstance(AppComponent.render, 'actionsMount', actionsMount, []);
    }
    AppComponent.prototype.ngOnInit = function () {
        console.log('onInit');
    };
    AppComponent.render = function (sr) {
        console.log('Rendering View');
        // Loop over the components being redered 
        var props = Object.getOwnPropertyNames(sr);
        props.forEach(function (prop) { return AppComponent._loader.loadAsRoot(compileToComponent(sr[prop], [ChildComponent, autogrow_directive_1.AutoGrowDirective]), '#' + prop, AppComponent._injector); });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            providers: [sam_service_1.SamService],
            template: '[Container]<br> <child id="container"></child> <br>[/Container]'
        }), 
        __metadata('design:paramtypes', [core_1.DynamicComponentLoader, core_1.Injector])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map