import { Component, ComponentFactory, ModuleWithComponentFactories, NgModule, Input, Injectable} from '@angular/core';
import { RuntimeCompiler } from '@angular/compiler';
import * as _ from 'lodash';    

export interface IHaveDynamicData { 
     entity: any;
}

@Injectable()
export class DynamicTypeBuilder {

  // wee need Dynamic component builder
  constructor(
    protected compiler: RuntimeCompiler
  ) {}
    
  // this object is singleton - so we can use this as a cache
  private _cacheOfFactories: {[templateKey: string]: ComponentFactory<IHaveDynamicData>} = {};
  
  public createComponentFactory(template: string)
    : Promise<ComponentFactory<IHaveDynamicData>> {

    console.log('createComponentFactory**********')
                
    let factory = this._cacheOfFactories[template];

    if (factory) {
        console.log("Module and Type are returned from cache")
       
        return new Promise((resolve) => {
            resolve(factory);
        });
    }
    
    // unknown template ... let's create a Type for it
    let type   = this.createNewComponent(template);
    let module = this.createComponentModule(type);
    
    console.log(type) ;
    console.log(module) ;

    return new Promise((resolve) => {
        this.compiler
            .compileModuleAndAllComponentsAsync(module)
            .then((moduleWithFactories: ModuleWithComponentFactories<IHaveDynamicData>) =>
            {
                factory = _.find(moduleWithFactories.componentFactories, { componentType: type });
                console.log(factory) ;
                this._cacheOfFactories[template] = factory;

                resolve(factory);
            });
    });
  }
  
  protected createNewComponent (tmpl:string) {
      @Component({
          selector: 'dynamic-component',
          template: tmpl,
      })
      class CustomDynamicComponent  implements IHaveDynamicData {
          @Input()  public entity: any;
      };
      // a component for this particular template
      return CustomDynamicComponent;
  }

  protected createComponentModule (componentType: any, modules?: Array<any>) {
      modules = modules || [] ;
      @NgModule({
        imports: modules,
        declarations: [
          componentType
        ],
      })
      class RuntimeComponentModule
      {
      }
      // a module for just this Type
      return RuntimeComponentModule;
  }
}