import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


// detail stuff
import { DynamicView }          from './dynamic.view';
import { DynamicTypeBuilder }     from './type.builder';
import { SamService }     from '../services/sam.service';

@NgModule({
  imports:      [ ],
  declarations: [ DynamicView ],
  exports:      [ DynamicView ],
})

export class DynamicModule {

    static forRoot()
    {
        return {
            ngModule: DynamicModule,
            providers: [ // singletons accross the whole app
              DynamicTypeBuilder, SamService
            ], 
        };
    }
}