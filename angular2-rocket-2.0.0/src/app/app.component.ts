import { Component, Injector, OnInit, AfterViewInit, Output, EventEmitter} from '@angular/core';

import {AutoGrowDirective} from './directives/autogrow.directive'




@Component({
  selector: 'app-root',
  template: '[Container]<br> <dynamic-view id="container"></dynamic-view> <br>[/Container]'
})


export class AppComponent {
  
    constructor() {} 

                
    
    stateRepresentation: string ;
  
    ngOnInit() {
      
      console.log('onInit') ;
    }
     
    

}