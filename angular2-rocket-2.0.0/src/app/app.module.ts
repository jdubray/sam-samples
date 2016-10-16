import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { COMPILER_PROVIDERS } from '@angular/compiler';

import { SamService }     from './services/sam.service';

import { AppComponent } from './app.component';
import { AutoGrowDirective } from './directives/autogrow.directive';
import { DynamicModule }    from './dynamic/dynamic.module';

@NgModule({
  declarations: [
    AppComponent, AutoGrowDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, DynamicModule.forRoot()
  ],
  providers: [
    COMPILER_PROVIDERS, SamService // this is an app singleton declaration
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
