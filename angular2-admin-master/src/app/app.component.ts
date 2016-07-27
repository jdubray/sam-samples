import './app.loader.ts';
import {Component, ViewEncapsulation} from "@angular/core";
import {State} from "./state/app.state";
import {BaThemeConfigProvider, BaThemeConfig} from "./theme";
import {BaThemeRun} from "./theme/directives";
import {BaImageLoaderService, BaThemePreloader, BaThemeSpinner} from "./theme/services";
import {layoutPaths} from "./theme/theme.constants";

// SAM Implementation
import { SamFactory }     from './services/sam.service';

import {FeedService}          from './services/feed.service';
import {LineChartService}     from './services/lineChart.service';
import {CalendarService}      from './services/calendar.service';
import {PieChartService}      from './services/pieChart.service';
import {TodoService}          from './services/todo.service';
import {UsersMapService}      from './services/usersMap.service';
import {TrafficChartService}  from './services/trafficChart.service';
declare var actionsMount: any;

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  pipes: [],
  directives: [BaThemeRun],
  providers: [BaThemeConfigProvider, BaThemeConfig, BaImageLoaderService, BaThemeSpinner,
    FeedService,LineChartService,CalendarService,PieChartService,TodoService,UsersMapService,TrafficChartService],
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

  isMenuCollapsed:boolean = false;

  constructor(
    private _state:State, 
    private _imageLoader:BaImageLoaderService, 
    private _spinner:BaThemeSpinner, 
    private _config:BaThemeConfig,
    
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
              {type:"actions", serviceName:'Feed', service:myFeedService, init: true},
              {type:"actions", serviceName:'LineChart', service:myLineChartService, init: true},
              {type:"actions", serviceName:'Calendar', service:myCalendarService, init: true},
              {type:"actions", serviceName:'PieChart', service:myPieChartService, init: true},
              {type:"actions", serviceName:'TrafficChart', service:myTrafficChartService, init: true},
              {type:"actions", serviceName:'ToDo', service:myTodoService, init: true},
              {type:"actions", serviceName:'UsersMap', service:myUsersMapService, init: true},
            ]
      );    

      this._loadImages();

      this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
        this.isMenuCollapsed = isCollapsed;
      });
  }

  public ngAfterViewInit():void {
    // hide spinner once all loaders are completed
    BaThemePreloader.load().then((values) => {
      this._spinner.hide();
    });
  }

  private _loadImages():void {
    // register some loaders
    BaThemePreloader.registerLoader(this._imageLoader.load(layoutPaths.images.root + 'sky-bg.jpg'));
  }
}
