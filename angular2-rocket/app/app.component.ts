
//import {Component,NgZone}  from '@angular/core';
import {Component, DynamicComponentLoader, Injector, OnInit, AfterViewInit, Output, EventEmitter} from '@angular/core'
import {AutoGrowDirective} from './directives/autogrow.directive'

import {State}            from './state/state' ;
import {Model}            from './model/model' ;
import {Actions}          from './actions/actions' ;
import {View}             from './views/view' ;

import { SamService }     from './services/sam.service';

// This is used to mount SAM's action in the DOM
declare var actionsMount: any;

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
  directives: [AutoGrowDirective],
})
class ChildComponent {
  @Output() complete = new EventEmitter();

}

@Component({
  selector: 'my-app',
  providers: [SamService],
  template: '[Container]<br> <child id="container"></child> <br>[/Container]'
})

export class AppComponent implements OnInit { 
    
    static _sam : any ;

    static _loader : DynamicComponentLoader ;
    static _injector : Injector ;
    
    constructor(private loader: DynamicComponentLoader, 
                private injector: Injector) {
                    

                    // Initialize Component Structure
                    AppComponent._loader = loader ;
                    AppComponent._injector = injector ;
                    
                    // Create a SAM instance
                    AppComponent._sam = SamService.SamInstance(
                                          AppComponent.render,
                                          'actionsMount',
                                          actionsMount,
                                          []
                                        );  

                }
    
    stateRepresentation: string ;
  
    ngOnInit() {
      
      console.log('onInit') ;
    }
     
    static render(sr: string) {
        
        console.log('Rendering View') ;
         
        // Loop over the components being redered 
        
        var props: string[] = Object.getOwnPropertyNames(sr) ;

        props.forEach( (prop) => AppComponent._loader.loadAsRoot(
            compileToComponent(sr[prop], [ChildComponent,AutoGrowDirective]), 
            '#'+prop, 
            AppComponent._injector
          ) 
        ) ; 
    }
    
}
