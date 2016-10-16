import { Component, ComponentRef,ViewChild,ViewContainerRef}   from '@angular/core';
import { AfterViewInit,OnInit,OnDestroy}          from '@angular/core';
import { OnChanges,SimpleChange,ComponentFactory} from '@angular/core';

import { IHaveDynamicData, DynamicTypeBuilder } from './type.builder';

import { SamService }     from '../services/sam.service';



declare var actionsMount: any;

function render(self:DynamicView) {
    let _self:DynamicView  = self;

    return function(sr:string) {
        _self.refreshContent(sr) ;
    }
}


@Component({
  selector: 'dynamic-view',
  template: `
<div>
    <hr />
    <div #dynamicContentPlaceHolder></div>
    <hr />
</div>
`,
})


export class DynamicView implements AfterViewInit, OnChanges, OnDestroy, OnInit
{ 
    // reference for a <div> with #dynamicContentPlaceHolder
    @ViewChild('dynamicContentPlaceHolder', {read: ViewContainerRef}) 
    protected dynamicComponentTarget: ViewContainerRef;
    // this will be reference to dynamic content - to be able to destroy it
    protected componentRef: ComponentRef<IHaveDynamicData>;
    
    // until ngAfterViewInit, we cannot start (firstly) to process dynamic stuff
    protected wasViewInitialized = false;
    
    public template: string = "";

    public _sam: any ;

    static sTypeBuilder : DynamicTypeBuilder ;

    // wee need Dynamic component builder
    constructor(
        protected typeBuilder: DynamicTypeBuilder
    ) {

          // Create a SAM instance
                    this._sam = SamService.SamInstance(
                                          render(this),
                                          'actionsMount',
                                          actionsMount,
                                          []
                                        );  

                    DynamicView.sTypeBuilder = this.typeBuilder;
    }

   /** Get a Factory and create a component */ 
    
    public refreshContent(sr: any){
        console.log('render ---------------') ;
        console.log(sr) ;

      if (this.componentRef) {
          this.componentRef.destroy();
      }
      
      // here we get a TEMPLATE with dynamic content === TODO
      //var template = this.templateBuilder.prepareTemplate(this.entity, useTextarea);
      //this.template = sr.container;
      // here we get Factory (just compiled or from cache)
      this.typeBuilder       
          .createComponentFactory(sr.container)
          .then((factory: ComponentFactory<IHaveDynamicData>) =>
        {
            // Target will instantiate and inject component (we'll keep reference to it)
            this.componentRef = this
                .dynamicComponentTarget
                .createComponent(factory);

            // let's inject @Inputs to component instance
            let component = this.componentRef.instance;

            //component.entity = this.entity;
            //...
        });
    }

    /** IN CASE WE WANT TO RE/Gerante - we need cean up */

    // this is the best moment where to start to process dynamic stuff
    public ngAfterViewInit(): void
    {
        this.wasViewInitialized = true; 
        //this.refreshContent();
    }
    // wasViewInitialized is an IMPORTANT switch 
    // when this component would have its own changing @Input()
    // - then we have to wait till view is intialized - first OnChange is too soon
    public ngOnChanges(changes: {[key: string]: SimpleChange}): void
    {
        if (this.wasViewInitialized) {
            return;
        }
        //this.refreshContent();
    }
    public ngOnDestroy(){
      if (this.componentRef) {
          this.componentRef.destroy();
          this.componentRef = null;
      }
    }

    public ngOnInit(){}
  
  
}



