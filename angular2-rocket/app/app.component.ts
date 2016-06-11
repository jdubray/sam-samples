//import {Component,NgZone}  from '@angular/core';
import {Component, DynamicComponentLoader, Injector, OnInit} from '@angular/core'
import {AutoGrowDirective} from './directives/autogrow.directive'

declare var view: any ;
declare var model: any ;

function compileToComponent(template: any, directives: any) {
  @Component({ 
    selector: 'view', 
    template , directives
  })
  class ViewComponent {};
  return ViewComponent;
}

@Component({
  selector: 'child-component',
  template: 'Child',
  directives: [AutoGrowDirective]
})
class ChildComponent {}

@Component({
  selector: 'my-app',
  template: '[Container]<br> <child id="child"></child> <br>[/Container]'
})

export class AppComponent implements OnInit { 
    
    //private zone: NgZone ;
    
    constructor(private loader: DynamicComponentLoader, 
                private injector: Injector) {
                    
                    loader.loadAsRoot(ChildComponent, '#child', injector);

                }
    
    stateRepresentation: string ;
  
    ngOnInit() {
      
      view.display = this.render ;
      //view.zone = this.zone ;
      view.component = this ;
      
      this.render(view.init(model)) ;
    }
     
    render(sr: string) {
        
        view.component.loader.loadAsRoot(compileToComponent(sr, [ChildComponent,AutoGrowDirective]), '#child', view.component.injector) ; 
        
    }
    
}
