import './app.loader.ts';
import { Component, ViewEncapsulation } from '@angular/core';
import { GlobalState } from './global.state';
import { BaImageLoaderService, BaThemePreloader, BaThemeSpinner } from './theme/services';
import { layoutPaths } from './theme/theme.constants';
import { BaThemeConfig } from './theme/theme.config';


// SAM Implementation
import { SamFactory }     from './services/sam.service';

import {FeedService}          from './services/feed.service';
import {LineChartService}     from './services/lineChart.service';
import {CalendarService}      from './services/calendar.service';
import {PieChartService}      from './services/pieChart.service';
import {TodoService}          from './services/todo.service';
import {UsersMapService}      from './services/usersMap.service';
import {TrafficChartService}  from './services/trafficChart.service';


import {State} from "./state/state"; 

declare var actionsMount: any;

/*
 * App Component
 * Top Level Component
 */ 
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styles: [require('normalize.css'), require('./app.scss')],
  template: `
    <main [ngClass]="{'menu-collapsed': isMenuCollapsed}" baThemeRun>
      <div class="additional-bg"></div>
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {

  public sam : any ;

  isMenuCollapsed: boolean = false;

  constructor(private _gstate: GlobalState,
              private _imageLoader: BaImageLoaderService,
              private _spinner: BaThemeSpinner,
              private _config:BaThemeConfig,
              
              private _state:State,  
    
              // SAM
              private myFeedService : FeedService,
              private myLineChartService : LineChartService,
              private myCalendarService : CalendarService,
              private myPieChartService : PieChartService,
              private myTodoService : TodoService,
              private myUsersMapService : UsersMapService,
              private myTrafficChartService: TrafficChartService
  ) {
 
    this.sam = SamFactory.instance(
            this,
            'actionsMount',
            actionsMount
            ,[
              {type:"actions", serviceName:'Feed', service:myFeedService, init: false},
              {type:"actions", serviceName:'LineChart', service:myLineChartService, init: false},
              {type:"actions", serviceName:'Calendar', service:myCalendarService, init: false},
              {type:"actions", serviceName:'PieChart', service:myPieChartService, init: false},
              {type:"actions", serviceName:'TrafficChart', service:myTrafficChartService, init: false},
              {type:"actions", serviceName:'ToDo', service:myTodoService, init: false},
              {type:"actions", serviceName:'UsersMap', service:myUsersMapService, init: false},
            ]
    );    

    this._loadImages();

    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
        this.isMenuCollapsed = isCollapsed;
    });

    this._gstate.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });

  }

  public ngAfterViewInit(): void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });
  }

  private _loadImages(): void {
    // register some loaders
    BaThemePreloader.registerLoader(this._imageLoader.load(layoutPaths.images.root + 'sky-bg.jpg'));
  }
}
